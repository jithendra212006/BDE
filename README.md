# StreamInsight — OTT Platform Analytics Dashboard 🎬📊

> **StreamInsight** is a modern, minimal OTT Platform Analytics Dashboard built for a **College Big Data Essentials (BDE)** project. It provides high-level executive and operational visibility into viewer concurrency, watch time, content completion, and subscription economics.

---

## 📌 Project Overview & Pipeline Stages

### 🟢 CURRENT STAGE (Frontend & Local Local Development)
- **Tech Stack**: Next.js 14, React 18, TypeScript, Tailwind CSS, Recharts, Lucide React.
- **Data Layer**: Centralized, mathematically consistent mock data store (`src/data/`) representing **24.8M global viewers**, **142.6M watch hours**, and **18.2M active subscribers**.
- **Service Layer**: Pluggable abstraction (`src/services/analyticsService.ts`) providing asynchronous methods that will seamlessly map to Big Data query endpoints in Phase 2.
- **Architecture**: 100% local in-browser execution with **zero external database, Kafka, or cluster dependencies required for local testing**.

```
+-----------------------------------------------------------------------------------+
|                            CURRENT IMPLEMENTATION                                 |
+-----------------------------------------------------------------------------------+
|  [ Centralized Mock Data Store ]                                                  |
|  • 24.8M Viewers Telemetry (mockUsers.ts)                                         |
|  • 16+ Rich OTT Catalog Titles (mockContent.ts)                                   |
|  • Multi-Range Time Series & KPIs (mockAnalytics.ts)                              |
|                              │                                                    |
|                              ▼                                                    |
|  [ Analytics Service Abstraction ] (src/services/analyticsService.ts)             |
|                              │                                                    |
|                              ▼                                                    |
|  [ StreamInsight Dashboard UI ] (Next.js + React + Tailwind + Recharts)           |
+-----------------------------------------------------------------------------------+
```

---

### 🔵 FUTURE STAGE (Big Data Pipeline Integration)
In Phase 2, the mock data layer will be replaced with batch and streaming outputs from a distributed Hadoop/Spark cluster:

```
[ OTT Viewing Events ]
        │ (Client Telemetry, QoS logs, and Playback events)
        ▼
[ Raw Data Ingestion ]
        │ (Snappy-compressed partitioned batch staging)
        ▼
[ Hadoop HDFS ]
        │ (Distributed Fault-Tolerant File System: /data/streaming/events/)
        ▼
[ Apache Hive ]
        │ (Data Warehouse & Schema-on-Read: dt=YYYY-MM-DD / country=XX)
        ▼
[ Apache Spark / PySpark ]
        │ (DataFrame Window Aggregations & Spark ML Churn Scoring)
        ▼
[ Processed Analytics Store ]
        │ (Pre-computed materialized dimensional facts / FastAPI bridge)
        ▼
[ StreamInsight Dashboard ]
        (Executive & Operational Visualization)
```

---

## 🎯 Key Analytics & Pages

1. **Executive Dashboard (`/` & `/dashboard`)**:
   - **4 Core KPIs**: Total Viewers (`24.8M`), Watch Time (`142.6M hrs`), Active Subscribers (`18.2M`), and Monthly Revenue (`$214.6M`).
   - **Watch Time Primary Chart**: Interactive line/area chart with **7D / 30D / 90D** range controls.
   - **Popular Genres**: Comparative horizontal bar chart for Drama, Action, Comedy, Thriller, Sci-Fi, and Anime.
   - **Viewing by Device**: Donut chart breakdown for Smart TV (44.5%), Mobile (31.2%), Laptop (14.8%), and Tablet (7.1%).
   - **Trending Content**: Top 5 highest-velocity titles with views and completion rates.

2. **Content Analytics (`/content`)**:
   - Searchable, sortable, and genre-filterable catalog table with completion rate meters and pagination.
   - Genre performance breakdown and completion rankings.

3. **Viewer Analytics (`/viewers`)**:
   - Audience demographics, new vs. returning viewers, and geographic distribution across 8 global markets (India, USA, UK, Canada, Japan, Germany, Australia, Brazil).
   - Viewer retention cohorts (Day 1, Day 7, Day 14, Day 30).

4. **Engagement Analytics (`/engagement`)**:
   - Average session duration (`64.2 min`), daily streaming volume (`4.82M hrs/day`), and 24-hour diurnal peak viewing curve (**8 PM - 11 PM prime peak**).

5. **Revenue & Subscriptions (`/revenue`)**:
   - Subscription tiers: **Basic ($7.99/mo • 30%)**, **Standard ($11.99/mo • 50%)**, and **Premium ($16.99/mo • 20%)**.
   - MRR (`$214.6M`), ARR (`$2.58B`), and Average Revenue Per User (`$11.79/mo`).
   - Regional ARPU distribution benchmarks.

6. **Reports & Data Architecture (`/reports`)**:
   - Downloadable analytics summaries (CSV / Parquet).
   - Visual Big Data pipeline architecture reference.

7. **System Settings (`/settings`)**:
   - Configurable parameters for Hadoop NameNode, Spark Master, and Hive Metastore endpoints.

---

## 📂 Project Structure

```
StreamInsight/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── content/page.tsx    # Content Analytics
│   │   ├── viewers/page.tsx    # Viewer Demographics & Retention
│   │   ├── engagement/page.tsx # Engagement & Peak Hours
│   │   ├── revenue/page.tsx    # Revenue & Subscriptions
│   │   ├── reports/page.tsx    # Reports & Architecture
│   │   ├── settings/page.tsx   # Pipeline Settings
│   │   ├── dashboard/page.tsx  # Dashboard Route Alias
│   │   ├── globals.css         # Dark Theme Styling
│   │   ├── layout.tsx          # Root Layout (Sidebar + Navbar)
│   │   └── page.tsx            # Main Dashboard
│   ├── components/
│   │   ├── dashboard/          # Reusable analytics components
│   │   │   ├── BigDataPipelineVisual.tsx
│   │   │   ├── CompletionRateRankings.tsx
│   │   │   ├── ContentPerformanceTable.tsx
│   │   │   ├── CountryAnalyticsPanel.tsx
│   │   │   ├── DeviceDonutChart.tsx
│   │   │   ├── GenreAnalyticsChart.tsx
│   │   │   ├── KPICard.tsx
│   │   │   ├── PeakHoursChart.tsx
│   │   │   ├── SubscriptionAnalyticsCard.tsx
│   │   │   ├── TrendingContentSection.tsx
│   │   │   ├── ViewerRetentionCard.tsx
│   │   │   └── WatchTimeChart.tsx
│   │   └── layout/
│   │       ├── Navbar.tsx      # Clean lightweight navbar
│   │       └── Sidebar.tsx     # Compact navigation sidebar
│   ├── data/                   # Centralized Mock Data Store
│   │   ├── index.ts
│   │   ├── mockAnalytics.ts    # Time series, KPIs, retention, peak hours
│   │   ├── mockContent.ts      # 16+ OTT titles and ratings
│   │   ├── mockUsers.ts        # Demographics, devices, subscriptions
│   │   └── mockViewingHistory.ts # Simulated clickstream logs
│   ├── lib/
│   │   └── utils.ts            # Number and currency formatting utilities
│   ├── services/
│   │   └── analyticsService.ts # Centralized Service Layer Abstraction
│   └── types/
│       └── analytics.ts        # Strict TypeScript interfaces
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18.17.0+ or v20+/v22+)
- npm

### Commands

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run local development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   ```
   http://localhost:3000
   ```

4. **Production build verification**:
   ```bash
   npm run build
   ```

---

## 🎓 Academic Context
- **Project**: StreamInsight — Big Data Essentials (BDE)
- **Status**: Frontend Complete & Ready for Big Data Engine Integration
