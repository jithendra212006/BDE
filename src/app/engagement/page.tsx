'use client';

import React from 'react';
import KPICard from '@/components/dashboard/KPICard';
import WatchTimeChart from '@/components/dashboard/WatchTimeChart';
import PeakHoursChart from '@/components/dashboard/PeakHoursChart';
import CompletionRateRankings from '@/components/dashboard/CompletionRateRankings';
import ViewerRetentionCard from '@/components/dashboard/ViewerRetentionCard';

export default function EngagementPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 py-2 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Engagement Analytics
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Viewing behavior, peak concurrency, session length, and completion benchmarks.
        </p>
      </div>

      {/* KPI Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          label="Avg Session Duration"
          value="64.2 min"
          changePercentage={6.1}
          isPositive={true}
          periodText="vs last month"
        />
        <KPICard
          label="Daily Streaming Volume"
          value="4.82M hrs"
          changePercentage={12.8}
          isPositive={true}
          periodText="hrs / day"
        />
        <KPICard
          label="Peak Concurrency"
          value="6.18M"
          changePercentage={9.2}
          isPositive={true}
          periodText="at 9:00 PM"
        />
        <KPICard
          label="Avg Catalog Completion"
          value="81.4%"
          changePercentage={3.4}
          isPositive={true}
          periodText="across titles"
        />
      </section>

      {/* Primary Chart: Watch Time */}
      <section>
        <WatchTimeChart initialRange="7d" />
      </section>

      {/* Peak Hours & Completion Rankings */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PeakHoursChart />
        <CompletionRateRankings />
      </section>

      {/* Retention Card */}
      <section>
        <ViewerRetentionCard />
      </section>
    </div>
  );
}
