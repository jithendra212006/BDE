"use client";

import React from "react";
import KPICard from "@/components/dashboard/KPICard";
import WatchTimeChart from "@/components/dashboard/WatchTimeChart";
import GenreAnalyticsChart from "@/components/dashboard/GenreAnalyticsChart";
import DeviceDonutChart from "@/components/dashboard/DeviceDonutChart";
import TrendingContentSection from "@/components/dashboard/TrendingContentSection";
import PipelineStatusBanner from "@/components/dashboard/PipelineStatusBanner";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 py-2 pb-12">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          OTT Platform Analytics
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Understand how viewers watch, discover, and engage with content.
        </p>
      </div>

      {/* Pipeline mode indicator */}
      <PipelineStatusBanner />

      {/* 4 Core KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          label="Total Viewers"
          value="24.8M"
          changePercentage={14.2}
          isPositive={true}
          periodText="vs last month"
        />
        <KPICard
          label="Watch Time"
          value="142.6M hrs"
          changePercentage={18.5}
          isPositive={true}
          periodText="vs last month"
        />
        <KPICard
          label="Active Subscribers"
          value="18.2M"
          changePercentage={9.4}
          isPositive={true}
          periodText="vs last month"
        />
        <KPICard
          label="Revenue"
          value="$214.6M"
          changePercentage={15.3}
          isPositive={true}
          periodText="vs last quarter"
        />
      </section>

      {/* Primary Chart: Watch Time */}
      <section>
        <WatchTimeChart initialRange="30d" />
      </section>

      {/* Secondary Analytics: Popular Genres & Viewing by Device */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenreAnalyticsChart />
        <DeviceDonutChart />
      </section>

      {/* Trending Content */}
      <section>
        <TrendingContentSection />
      </section>
    </div>
  );
}
