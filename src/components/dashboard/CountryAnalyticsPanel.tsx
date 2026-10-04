'use client';

import React, { useState, useEffect } from 'react';
import { CountryAnalytics } from '@/types/analytics';
import { analyticsService } from '@/services/analyticsService';

export default function CountryAnalyticsPanel() {
  const [countries, setCountries] = useState<CountryAnalytics[]>([]);

  useEffect(() => {
    analyticsService.getCountryAnalytics().then((res) => setCountries(res));
  }, []);

  return (
    <div className="card-clean p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="pb-4">
        <h3 className="text-base font-semibold text-white tracking-tight">
          Viewer Distribution by Country
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Top geographic streaming regions
        </p>
      </div>

      {/* List */}
      <div className="space-y-3.5 my-2">
        {countries.map((item, index) => (
          <div key={item.countryCode} className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm leading-none">{item.flagEmoji}</span>
                <span className="font-medium text-gray-200">{item.country}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400">
                  {(item.viewerCount / 1000000).toFixed(2)}M viewers
                </span>
                <span className="font-semibold text-white min-w-[36px] text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>

            <div className="w-full bg-[#1A1E29] rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-red-600 rounded-full"
                style={{ width: `${item.percentage * 2.2}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
