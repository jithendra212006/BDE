'use client';

import React, { useState, useEffect } from 'react';
import { SubscriptionAnalytics } from '@/types/analytics';
import { analyticsService } from '@/services/analyticsService';
import { formatCurrency, formatCompactNumber } from '@/lib/utils';

export default function SubscriptionAnalyticsCard() {
  const [tiers, setTiers] = useState<SubscriptionAnalytics[]>([]);

  useEffect(() => {
    analyticsService.getSubscriptionAnalytics().then((res) => setTiers(res));
  }, []);

  const totalRevenue = tiers.reduce((acc, curr) => acc + curr.estimatedRevenue, 0);

  return (
    <div className="card-clean p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Subscription Plans
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Active subscriber breakdown and revenue contribution
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-400 block">Total Monthly MRR</span>
          <span className="text-base font-bold text-white">{formatCurrency(totalRevenue)}</span>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tiers.map((tier) => (
          <div
            key={tier.tier}
            className="p-5 rounded-lg bg-[#141720] border border-[#1E2330] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">{tier.tier}</span>
                <span className="text-gray-400">${tier.monthlyPrice}/mo</span>
              </div>
              <div className="text-2xl font-bold text-white mt-2">
                {formatCompactNumber(tier.subscribers)}
                <span className="text-xs font-normal text-gray-400 ml-1">users</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#1E2330]">
              <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
                <span>Revenue Share</span>
                <span className="font-medium text-white">{tier.percentage}%</span>
              </div>
              <div className="w-full bg-[#1E2330] rounded-full h-1 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${tier.percentage}%`, backgroundColor: tier.color }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-xs">
                <span className="text-gray-300 font-medium">{formatCurrency(tier.estimatedRevenue)}</span>
                <span className="text-emerald-400">+{tier.growthRate}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
