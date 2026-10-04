'use client';

import React, { useState, useEffect } from 'react';
import { ContentItem } from '@/types/analytics';
import { analyticsService } from '@/services/analyticsService';
import { formatCompactNumber } from '@/lib/utils';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function TrendingContentSection() {
  const [trending, setTrending] = useState<ContentItem[]>([]);

  useEffect(() => {
    analyticsService.getTrendingContent(5).then((res) => setTrending(res));
  }, []);

  return (
    <div className="card-clean p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-5">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Trending Content
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Top 5 highest velocity titles across the platform
          </p>
        </div>

        <Link
          href="/content"
          className="text-xs font-medium text-red-500 hover:text-red-400 flex items-center gap-1 transition-colors"
        >
          View all catalog
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Clean Table / Rows */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#1E2330] text-gray-400 font-medium">
              <th className="pb-3 px-2 w-12">#</th>
              <th className="pb-3 px-4">Title</th>
              <th className="pb-3 px-4">Genre</th>
              <th className="pb-3 px-4 text-right">Views</th>
              <th className="pb-3 px-4 text-right">Completion Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2330]">
            {trending.map((item, index) => (
              <tr key={item.id} className="hover:bg-[#161924] transition-colors group">
                <td className="py-3.5 px-2 font-medium text-gray-500">
                  0{index + 1}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded bg-gradient-to-br ${item.posterColor} flex items-center justify-center font-bold text-[10px] text-white/90 shrink-0`}
                    >
                      {item.title.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-white group-hover:text-red-400 transition-colors">
                      {item.title}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-gray-400">
                  {item.genre}
                </td>
                <td className="py-3.5 px-4 text-right font-medium text-gray-200">
                  {formatCompactNumber(item.totalViews)}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <span className="font-semibold text-emerald-400">
                      {item.completionRate}%
                    </span>
                    <div className="w-14 bg-[#1E2330] rounded-full h-1.5 overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${item.completionRate}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
