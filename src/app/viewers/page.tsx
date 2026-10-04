'use client';

import React from 'react';
import KPICard from '@/components/dashboard/KPICard';
import CountryAnalyticsPanel from '@/components/dashboard/CountryAnalyticsPanel';
import ViewerRetentionCard from '@/components/dashboard/ViewerRetentionCard';
import DeviceDonutChart from '@/components/dashboard/DeviceDonutChart';

export default function ViewersPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 py-2 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Viewer Analytics
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Audience demographics, geographic distribution, and retention dynamics.
        </p>
      </div>

      {/* KPI Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          label="Total Viewers"
          value="24.8M"
          changePercentage={14.2}
          isPositive={true}
          periodText="vs last month"
        />
        <KPICard
          label="New Viewers"
          value="3.4M"
          changePercentage={8.6}
          isPositive={true}
          periodText="this month"
        />
        <KPICard
          label="Returning Viewers"
          value="21.4M"
          changePercentage={15.1}
          isPositive={true}
          periodText="86.2% return rate"
        />
        <KPICard
          label="Viewer Growth (YoY)"
          value="+28.4%"
          changePercentage={4.2}
          isPositive={true}
          periodText="annual pace"
        />
      </section>

      {/* Retention Cohort Breakdown */}
      <section>
        <ViewerRetentionCard />
      </section>

      {/* Geographic Distribution & Device */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CountryAnalyticsPanel />
        <DeviceDonutChart />
      </section>
    </div>
  );
}
