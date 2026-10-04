'use client';

import React, { useState, useEffect } from 'react';
import { RetentionCohort } from '@/types/analytics';
import { analyticsService } from '@/services/analyticsService';

export default function ViewerRetentionCard() {
  const [retention, setRetention] = useState<RetentionCohort[]>([]);

  useEffect(() => {
    analyticsService.getViewerRetention().then((res) => setRetention(res));
  }, []);

  return (
    <div className="card-clean p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="pb-4">
        <h3 className="text-base font-semibold text-white tracking-tight">
          Viewer Retention
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Percentage of audience returning to the platform post-signup
        </p>
      </div>

      {/* Cohort Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-2">
        {retention.map((item) => (
          <div
            key={item.period}
            className="p-4 rounded-lg bg-[#141720] border border-[#1E2330] flex flex-col justify-between"
          >
            <span className="text-xs text-gray-400 font-medium">{item.period}</span>
            <div className="my-2">
              <span className="text-2xl font-bold text-white font-sans">{item.retentionRate}%</span>
            </div>
            <div className="w-full bg-[#1E2330] rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${item.retentionRate}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 mt-2">
              Benchmark: {item.industryBenchmark}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
