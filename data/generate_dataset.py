"""
generate_dataset.py
-------------------
Generates a realistic OTT viewing dataset CSV (~10 000 rows) that represents
raw clickstream / playback-session log data.  This file simulates what would
normally land in Hadoop HDFS from a real streaming platform's event pipeline.

Run once to produce:  data/ott_viewing_data.csv
"""

import csv
import random
import uuid
from datetime import datetime, timedelta

random.seed(42)

# ── Domain constants ─────────────────────────────────────────────────────────
CONTENT = [
    ("The Last Signal",         "Sci-Fi",       142),
    ("Parallel",                "Thriller",     118),
    ("Midnight Protocol",       "Action",       135),
    ("City of Shadows",         "Drama",         58),
    ("Beyond Mars",             "Sci-Fi",        62),
    ("Code Zero",               "Thriller",     126),
    ("The Silent Room",         "Horror",       104),
    ("Tokyo Monolith",          "Anime",         24),
    ("Crown & Iron",            "Drama",         55),
    ("Laugh Track Chaos",       "Comedy",        28),
    ("Secrets of the Deep Abyss","Documentary",  88),
    ("Redline Syndicate",       "Action",       112),
    ("Echoes of Eternity",      "Drama",        130),
    ("Neon Genesis 2099",       "Anime",         25),
    ("The Algorithm of Fear",   "Horror",        98),
    ("Cosmic Architects",       "Documentary",   60),
]

COUNTRIES   = ["India","USA","UK","Canada","Japan","Germany","Australia","Brazil"]
# Weighted to match: India 38.4 %, USA 24.1 %, UK 11.2 %, …
COUNTRY_W   = [38.4, 24.1, 11.2, 7.8, 6.4, 5.1, 4.2, 2.8]
DEVICES     = ["Smart TV","Mobile","Laptop","Tablet","Other"]
DEVICE_W    = [44.5, 31.2, 14.8, 7.1, 2.4]
PLANS       = ["Basic","Standard","Premium"]
PLAN_W      = [30, 50, 20]

BASE_DATE   = datetime(2024, 10, 1)

# ── Helpers ───────────────────────────────────────────────────────────────────
def wrand(pop, weights):
    return random.choices(pop, weights=weights, k=1)[0]

def rand_session_date():
    return BASE_DATE + timedelta(days=random.randint(0, 50),
                                  hours=random.randint(0, 23),
                                  minutes=random.randint(0, 59))

def completion(title, device, plan):
    """Realistic completion rate influenced by title, device and plan."""
    base = {
        "The Last Signal": 94, "Tokyo Monolith": 91, "Parallel": 89,
        "Secrets of the Deep Abyss": 87, "Laugh Track Chaos": 86,
        "Midnight Protocol": 83, "Beyond Mars": 81, "Crown & Iron": 88,
        "City of Shadows": 77, "Code Zero": 75, "The Silent Room": 71,
        "Cosmic Architects": 83, "Redline Syndicate": 79,
        "Echoes of Eternity": 76, "Neon Genesis 2099": 92,
        "The Algorithm of Fear": 69,
    }.get(title, 78)
    if device == "Smart TV":   base += 3
    elif device == "Mobile":   base -= 5
    if plan == "Premium":      base += 2
    elif plan == "Basic":      base -= 3
    base = max(30, min(100, base + random.randint(-8, 8)))
    return round(base / 100, 4)

def bitrate(device):
    return {
        "Smart TV": round(random.uniform(15.0, 25.0), 2),
        "Mobile":   round(random.uniform(3.0,  8.0),  2),
        "Laptop":   round(random.uniform(8.0,  18.0), 2),
        "Tablet":   round(random.uniform(5.0,  12.0), 2),
        "Other":    round(random.uniform(4.0,  10.0), 2),
    }[device]

# ── Generate rows ─────────────────────────────────────────────────────────────
rows = []
for _ in range(10_000):
    title, genre, dur = random.choice(CONTENT)
    country = wrand(COUNTRIES, COUNTRY_W)
    device  = wrand(DEVICES, DEVICE_W)
    plan    = wrand(PLANS, PLAN_W)
    comp    = completion(title, device, plan)
    watched = round(dur * comp)
    dt      = rand_session_date()

    rows.append({
        "session_id":           str(uuid.uuid4()),
        "user_id":              f"U{random.randint(100000, 999999)}",
        "content_title":        title,
        "genre":                genre,
        "duration_minutes":     dur,
        "watched_minutes":      watched,
        "completion_rate":      comp,
        "country":              country,
        "device_type":          device,
        "subscription_plan":    plan,
        "avg_bitrate_mbps":     bitrate(device),
        "buffer_events":        random.randint(0, 4),
        "session_date":         dt.strftime("%Y-%m-%d"),
        "session_hour":         dt.hour,
        "rating":               round(random.uniform(3.5, 5.0), 1),
    })

OUT = "data/ott_viewing_data.csv"
with open(OUT, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print(f"[OK] Dataset written -> {OUT}  ({len(rows):,} rows)")
