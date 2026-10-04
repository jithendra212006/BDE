'use client';

import React, { useState, useEffect } from 'react';
import { CompletionRateItem } from '@/types/analytics';
import { analyticsService } from '@/services/analyticsService';

export default function CompletionRateRankings() {
  const [items, setItems] = useState<CompletionRateItem[]>([]);

  useEffect(() => {
    analyticsService.getCompletionRateRankings().then((res) => setItems(res.slice(0, 6)));
  }, []);

  return (
    <div className="card-clean p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="pb-4">
        <h3 className="text-base font-semibold text-white tracking-tight">
          Completion Rates
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Titles with highest full-playback percentage
        </p>
      </div>

      {/* List */}
      <div className="space-y-4 my-2">
        {items.map((item, index) => (
          <div key={item.id} className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium w-4">{index + 1}.</span>
                <span className="font-medium text-gray-200">{item.title}</span>
                <span className="text-[10px] text-gray-500">({item.genre})</span>
              </div>
              <span className="font-semibold text-emerald-400">
                {item.completionRate}%
              </span>
            </div>

            <div className="w-full bg-[#1A1E29] rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${item.completionRate}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
