"""
spark_etl.py
------------
PySpark ETL pipeline for StreamInsight OTT analytics.

Pipeline stages:
  1. Ingest CSV (simulates reading from Hadoop HDFS)
  2. Clean & validate records
  3. Run distributed SQL / DataFrame aggregations
  4. Write output JSON files to spark/output/
     (simulates writing processed results back to HDFS / a serving layer)

These JSON files are then served by the FastAPI backend.

Usage:
  python spark/spark_etl.py
"""

import os
import sys
import json
import math

# ── Fix PySpark / SPARK_HOME version mismatch ────────────────────────────────
# If SPARK_HOME points to a different Spark version than the pip-installed
# PySpark package, the JVM bridge will crash with a Py4JError.
# Remove SPARK_HOME so PySpark 3.5.x uses its own bundled JARs.
os.environ.pop("SPARK_HOME", None)
os.environ.pop("SPARK_HOME_FALLBACK", None)
# Ensure the correct Python interpreter is used by PySpark workers
os.environ.setdefault("PYSPARK_PYTHON", sys.executable)
os.environ.setdefault("PYSPARK_DRIVER_PYTHON", sys.executable)

from pyspark.sql import SparkSession
from pyspark.sql import functions as F
from pyspark.sql.types import DoubleType

# ── Paths ─────────────────────────────────────────────────────────────────────
ROOT       = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INPUT_CSV  = os.path.join(ROOT, "data", "ott_viewing_data.csv")
OUTPUT_DIR = os.path.join(ROOT, "spark", "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── Spark Session ─────────────────────────────────────────────────────────────
spark = (
    SparkSession.builder
    .appName("StreamInsight-OTT-ETL")
    .master("local[*]")
    .config("spark.sql.shuffle.partitions", "4")
    .config("spark.driver.memory", "2g")
    .config("spark.ui.enabled", "false")
    .getOrCreate()
)
spark.sparkContext.setLogLevel("ERROR")
print("[Spark] Session started")

# ── 1. Ingest ─────────────────────────────────────────────────────────────────
df_raw = (
    spark.read
    .option("header", "true")
    .option("inferSchema", "true")
    .csv(INPUT_CSV)
)
total_rows = df_raw.count()
print(f"[Spark] Ingested {total_rows:,} raw rows from {INPUT_CSV}")

# ── 2. Clean / Validate ───────────────────────────────────────────────────────
df = (
    df_raw
    .dropna(subset=["session_id", "user_id", "content_title", "genre",
                    "country", "device_type", "subscription_plan"])
    .filter(
        (F.col("watched_minutes") >= 0) &
        (F.col("duration_minutes") > 0) &
        (F.col("completion_rate").between(0.0, 1.0)) &
        (F.col("session_hour").between(0, 23))
    )
    .withColumn("completion_pct", (F.col("completion_rate") * 100).cast(DoubleType()))
)
clean_rows = df.count()
print(f"[Spark] After cleaning: {clean_rows:,} rows ({total_rows - clean_rows} dropped)")
df.cache()

# ── Helper: round to 2 dp ─────────────────────────────────────────────────────
r2 = lambda x: round(float(x), 2) if x is not None else 0.0

# ── 3a. KPI Overview ──────────────────────────────────────────────────────────
kpi_row = df.agg(
    F.countDistinct("user_id").alias("unique_viewers"),
    F.countDistinct("session_id").alias("total_sessions"),
    (F.sum("watched_minutes") / 60).alias("total_watch_hours"),
    F.avg("completion_pct").alias("avg_completion_rate"),
    F.avg("avg_bitrate_mbps").alias("avg_bitrate"),
).first()

# Subscriptions per plan (for MRR calculation)
plan_prices = {"Basic": 7.99, "Standard": 11.99, "Premium": 16.99}
plan_df = df.groupBy("subscription_plan").agg(
    F.countDistinct("user_id").alias("subscribers")
).collect()
plan_subs = {r["subscription_plan"]: r["subscribers"] for r in plan_df}
total_subs = sum(plan_subs.values())
mrr = sum(plan_subs.get(p, 0) * plan_prices[p] for p in plan_prices)
arpu = mrr / total_subs if total_subs else 0
arr  = mrr * 12

# Session duration estimate  = total_watch_hours / total_sessions * 60  (minutes)
avg_session_min = (
    r2(kpi_row["total_watch_hours"]) * 60 / kpi_row["total_sessions"]
    if kpi_row["total_sessions"] else 0
)

kpi_out = {
    "unique_viewers":      int(kpi_row["unique_viewers"]),
    "total_sessions":      int(kpi_row["total_sessions"]),
    "total_watch_hours_m": r2(kpi_row["total_watch_hours"] / 1_000_000),
    "total_watch_hours_raw": r2(kpi_row["total_watch_hours"]),
    "avg_completion_rate": r2(kpi_row["avg_completion_rate"]),
    "avg_bitrate_mbps":    r2(kpi_row["avg_bitrate"]),
    "avg_session_min":     r2(avg_session_min),
    "total_subscribers":   total_subs,
    "mrr":                 r2(mrr),
    "mrr_display":         f"${mrr/1_000_000:.1f}M",
    "arpu":                r2(arpu),
    "arr_display":         f"${arr/1_000_000_000:.2f}B",
}
print(f"[Spark] KPIs computed: {kpi_out['unique_viewers']:,} viewers, MRR={kpi_out['mrr_display']}")

# ── 3b. Watch Time – time series (daily) ──────────────────────────────────────
watch_ts = (
    df.groupBy("session_date")
    .agg(
        (F.sum("watched_minutes") / 60).alias("watch_hours"),
        F.countDistinct("session_id").alias("active_streams"),
        F.countDistinct("user_id").alias("unique_viewers"),
    )
    .orderBy("session_date")
)
watch_ts_data = [
    {
        "date":           r["session_date"],
        "formattedDate":  r["session_date"],
        "watchHours":     r2(r["watch_hours"] / 1000),   # thousands of hours
        "activeStreams":  int(r["active_streams"]),
        "uniqueViewers":  int(r["unique_viewers"]),
    }
    for r in watch_ts.collect()
]
print(f"[Spark] Watch time series: {len(watch_ts_data)} days")

# ── 3c. Genre Analytics ───────────────────────────────────────────────────────
total_wh = df.agg(F.sum("watched_minutes").alias("t")).first()["t"] or 1
genre_agg = (
    df.groupBy("genre")
    .agg(
        (F.sum("watched_minutes") / 60).alias("watch_hours"),
        F.count("session_id").alias("total_streams"),
        F.avg("completion_pct").alias("avg_completion"),
    )
    .orderBy(F.col("watch_hours").desc())
)
GENRE_COLORS = {
    "Drama": "#E50914", "Action": "#F97316", "Sci-Fi": "#3B82F6",
    "Thriller": "#8B5CF6", "Comedy": "#EAB308", "Anime": "#EC4899",
    "Horror": "#10B981", "Documentary": "#06B6D4",
}
genre_data = []
for r in genre_agg.collect():
    wh = float(r["watch_hours"])
    genre_data.append({
        "genre":            r["genre"],
        "watchHours":       r2(wh / 1000),
        "totalStreams":     int(r["total_streams"]),
        "sharePercentage":  r2(wh * 60 / total_wh * 100),
        "avgCompletionRate": r2(float(r["avg_completion"])),
        "color":            GENRE_COLORS.get(r["genre"], "#64748B"),
    })
print(f"[Spark] Genre analytics: {len(genre_data)} genres")

# ── 3d. Peak Viewing Hours ────────────────────────────────────────────────────
peak_agg = (
    df.groupBy("session_hour")
    .agg(
        F.countDistinct("user_id").alias("viewers_count"),
        F.count("session_id").alias("streams_count"),
    )
    .orderBy("session_hour")
)
def fmt_hour(h):
    if h == 0:  return "12 AM"
    if h < 12:  return f"{h} AM"
    if h == 12: return "12 PM"
    return f"{h-12} PM"

peak_data = [
    {
        "hour":         fmt_hour(r["session_hour"]),
        "hour24":       r["session_hour"],
        "viewersCount": int(r["viewers_count"]),
        "streamsCount": int(r["streams_count"]),
        "isPeak":       r["session_hour"] in (20, 21, 22),
    }
    for r in peak_agg.collect()
]
print(f"[Spark] Peak hours: {len(peak_data)} slots")

# ── 3e. Device Analytics ──────────────────────────────────────────────────────
device_total = df.count()
device_agg = (
    df.groupBy("device_type")
    .agg(
        F.count("session_id").alias("total_streams"),
        (F.sum("watched_minutes") / 60).alias("watch_hours"),
    )
    .orderBy(F.col("total_streams").desc())
)
DEVICE_COLORS = {
    "Smart TV": "#E50914", "Mobile": "#3B82F6",
    "Laptop": "#10B981", "Tablet": "#F59E0B", "Other": "#8B5CF6",
}
device_data = [
    {
        "device":       r["device_type"],
        "percentage":   r2(r["total_streams"] / device_total * 100),
        "totalStreams":  int(r["total_streams"]),
        "watchHours":   r2(float(r["watch_hours"])),
        "color":        DEVICE_COLORS.get(r["device_type"], "#64748B"),
    }
    for r in device_agg.collect()
]
print(f"[Spark] Device analytics: {len(device_data)} devices")

# ── 3f. Country Analytics ─────────────────────────────────────────────────────
country_total_viewers = df.agg(F.countDistinct("user_id")).first()[0]
country_agg = (
    df.groupBy("country")
    .agg(
        F.countDistinct("user_id").alias("viewer_count"),
        (F.sum("watched_minutes") / 60).alias("watch_hours"),
    )
    .orderBy(F.col("viewer_count").desc())
)
FLAG_MAP = {
    "India": "🇮🇳", "USA": "🇺🇸", "UK": "🇬🇧", "Canada": "🇨🇦",
    "Japan": "🇯🇵", "Germany": "🇩🇪", "Australia": "🇦🇺", "Brazil": "🇧🇷",
}
GROWTH_MAP = {
    "India": 24.6, "USA": 8.2, "UK": 12.1, "Canada": 9.5,
    "Japan": 15.8, "Germany": 6.7, "Australia": 11.0, "Brazil": 19.4,
}
country_data = [
    {
        "country":     r["country"],
        "countryCode": r["country"][:2].upper(),
        "flagEmoji":   FLAG_MAP.get(r["country"], "🌍"),
        "viewerCount": int(r["viewer_count"]),
        "percentage":  r2(r["viewer_count"] / country_total_viewers * 100),
        "watchHours":  r2(float(r["watch_hours"])),
        "growthRate":  GROWTH_MAP.get(r["country"], 5.0),
    }
    for r in country_agg.collect()
]
print(f"[Spark] Country analytics: {len(country_data)} countries")

# ── 3g. Content Performance ───────────────────────────────────────────────────
content_agg = (
    df.groupBy("content_title", "genre")
    .agg(
        F.count("session_id").alias("total_views"),
        (F.sum("watched_minutes") / 60).alias("total_watch_hours"),
        F.avg("completion_pct").alias("avg_completion_rate"),
        F.avg("rating").alias("avg_rating"),
    )
    .orderBy(F.col("total_views").desc())
)
POSTER_COLORS = {
    "The Last Signal":           "from-blue-900 via-indigo-950 to-black",
    "Parallel":                  "from-purple-900 via-slate-900 to-black",
    "Midnight Protocol":         "from-red-950 via-zinc-900 to-black",
    "City of Shadows":           "from-amber-950 via-stone-900 to-black",
    "Beyond Mars":               "from-orange-950 via-red-950 to-black",
    "Code Zero":                 "from-emerald-950 via-slate-900 to-black",
    "The Silent Room":           "from-rose-950 via-neutral-900 to-black",
    "Tokyo Monolith":            "from-fuchsia-950 via-purple-950 to-black",
    "Crown & Iron":              "from-amber-900 via-amber-950 to-black",
    "Laugh Track Chaos":         "from-yellow-950 via-zinc-900 to-black",
    "Secrets of the Deep Abyss": "from-cyan-950 via-blue-950 to-black",
    "Redline Syndicate":         "from-red-900 via-neutral-900 to-black",
    "Echoes of Eternity":        "from-indigo-950 via-slate-900 to-black",
    "Neon Genesis 2099":         "from-pink-950 via-purple-950 to-black",
    "The Algorithm of Fear":     "from-violet-950 via-zinc-950 to-black",
    "Cosmic Architects":         "from-teal-950 via-slate-900 to-black",
}
content_rows = content_agg.collect()
content_data = []
for i, r in enumerate(content_rows):
    content_data.append({
        "id":              f"cont-{str(i+1).zfill(3)}",
        "title":           r["content_title"],
        "genre":           r["genre"],
        "totalViews":      int(r["total_views"]),
        "totalWatchHours": r2(float(r["total_watch_hours"])),
        "completionRate":  r2(float(r["avg_completion_rate"])),
        "rating":          r2(float(r["avg_rating"])),
        "trendScore":      r2(10 + i * 2.5 % 30),
        "isTrending":      i < 8,
        "rank":            i + 1 if i < 8 else None,
        "posterColor":     POSTER_COLORS.get(r["content_title"], "from-slate-900 via-gray-900 to-black"),
    })
print(f"[Spark] Content performance: {len(content_data)} titles")

# ── 3h. Subscription Analytics ────────────────────────────────────────────────
sub_agg = (
    df.groupBy("subscription_plan")
    .agg(F.countDistinct("user_id").alias("subscribers"))
    .collect()
)
sub_data = []
SUB_COLORS = {"Basic": "#64748B", "Standard": "#3B82F6", "Premium": "#E50914"}
for r in sub_agg:
    plan = r["subscription_plan"]
    subs = int(r["subscribers"])
    rev  = subs * plan_prices.get(plan, 0)
    sub_data.append({
        "tier":              plan,
        "subscribers":       subs,
        "percentage":        r2(subs / total_subs * 100),
        "monthlyPrice":      plan_prices.get(plan, 0),
        "estimatedRevenue":  r2(rev),
        "growthRate":        {"Basic": 6.4, "Standard": 10.8, "Premium": 16.2}.get(plan, 5.0),
        "color":             SUB_COLORS.get(plan, "#64748B"),
    })
sub_data.sort(key=lambda x: x["tier"])
print(f"[Spark] Subscription analytics: {len(sub_data)} tiers")

# ── 3i. Retention Cohorts (analytical estimate from session patterns) ─────────
# In a real pipeline, this would be calculated from user cohort tracking tables.
# Here we derive it from the session dataset: fraction of users with sessions in
# different weeks after their first session.
user_first = df.groupBy("user_id").agg(F.min("session_date").alias("first_date"))
user_sessions = df.select("user_id", "session_date")
joined = user_sessions.join(user_first, "user_id")
joined = joined.withColumn(
    "days_since_first",
    F.datediff(F.col("session_date"), F.col("first_date"))
)
total_users = user_first.count()
def ret_rate(min_days, max_days):
    cnt = joined.filter(
        (F.col("days_since_first") >= min_days) &
        (F.col("days_since_first") <= max_days)
    ).select("user_id").distinct().count()
    return r2(cnt / total_users * 100)

retention_data = [
    {"period": "Day 1",  "retentionRate": ret_rate(1, 2),  "industryBenchmark": 80.0},
    {"period": "Day 7",  "retentionRate": ret_rate(6, 8),  "industryBenchmark": 55.0},
    {"period": "Day 14", "retentionRate": ret_rate(13, 16),"industryBenchmark": 40.0},
    {"period": "Day 30", "retentionRate": ret_rate(28, 35),"industryBenchmark": 30.0},
]
print(f"[Spark] Retention cohorts computed")

# ── 4. Write outputs ──────────────────────────────────────────────────────────
import datetime

class _DateEncoder(json.JSONEncoder):
    """Serialize datetime.date / datetime.datetime as ISO strings."""
    def default(self, obj):
        if isinstance(obj, (datetime.date, datetime.datetime)):
            return obj.isoformat()
        return super().default(obj)

outputs = {
    "kpi.json":           kpi_out,
    "watch_time.json":    watch_ts_data,
    "genres.json":        genre_data,
    "peak_hours.json":    peak_data,
    "devices.json":       device_data,
    "countries.json":     country_data,
    "content.json":       content_data,
    "subscriptions.json": sub_data,
    "retention.json":     retention_data,
}
for fname, payload in outputs.items():
    path = os.path.join(OUTPUT_DIR, fname)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2, cls=_DateEncoder)
    print(f"[Spark] Written -> spark/output/{fname}")

spark.stop()
print("[Spark] ETL complete - all outputs ready for FastAPI")


spark.stop()
print("[Spark] ETL complete - all outputs ready for FastAPI")
