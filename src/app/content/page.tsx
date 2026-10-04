'use client';

import React from 'react';
import ContentPerformanceTable from '@/components/dashboard/ContentPerformanceTable';
import GenreAnalyticsChart from '@/components/dashboard/GenreAnalyticsChart';
import CompletionRateRankings from '@/components/dashboard/CompletionRateRankings';

export default function ContentPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 py-2 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Content Analytics
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Catalog performance, completion rates, and genre engagement.
        </p>
      </div>

      {/* Catalog Table */}
      <section>
        <ContentPerformanceTable />
      </section>

      {/* Secondary charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenreAnalyticsChart />
        <CompletionRateRankings />
      </section>
    </div>
  );
}
