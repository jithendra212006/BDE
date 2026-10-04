"use client";

import React from "react";
import KPICard from "@/components/dashboard/KPICard";
import SubscriptionAnalyticsCard from "@/components/dashboard/SubscriptionAnalyticsCard";

export default function RevenuePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 py-2 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Revenue & Subscriptions
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Monthly recurring revenue, subscriber tier distribution, and
          monetization growth.
        </p>
      </div>

      {/* KPI Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          label="Monthly Revenue (MRR)"
          value="$184.2M"
          changePercentage={15.3}
          isPositive={true}
          periodText="vs last quarter"
        />
        <KPICard
          label="Average Revenue Per User"
          value="$14.75"
          changePercentage={6.2}
          isPositive={true}
          periodText="ARPU / mo"
        />
        <KPICard
          label="Active Paid Subscribers"
          value="18.2M"
          changePercentage={9.4}
          isPositive={true}
          periodText="vs last month"
        />
        <KPICard
          label="Annual Run Rate (ARR)"
          value="$2.21B"
          changePercentage={14.8}
          isPositive={true}
          periodText="projected"
        />
      </section>

      {/* Subscription Tier Breakdown */}
      <section>
        <SubscriptionAnalyticsCard />
      </section>

      {/* Regional ARPU */}
      <section className="card-clean p-6">
        <h3 className="text-base font-semibold text-white tracking-tight mb-1">
          Regional ARPU Distribution
        </h3>
        <p className="text-xs text-gray-400 mb-5">
          Average revenue per subscriber segmented by key markets
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-[#141720] border border-[#1E2330]">
            <span className="text-xs text-gray-400 block mb-1">
              North America
            </span>
            <div className="text-xl font-bold text-white">
              $17.80{" "}
              <span className="text-xs text-emerald-400 font-normal">
                (+$1.20)
              </span>
            </div>
            <span className="text-[11px] text-gray-500 mt-1 block">
              78% Premium plan adoption
            </span>
          </div>
          <div className="p-4 rounded-lg bg-[#141720] border border-[#1E2330]">
            <span className="text-xs text-gray-400 block mb-1">Europe</span>
            <div className="text-xl font-bold text-white">
              $16.20{" "}
              <span className="text-xs text-emerald-400 font-normal">
                (+$0.80)
              </span>
            </div>
            <span className="text-[11px] text-gray-500 mt-1 block">
              64% Standard / Premium
            </span>
          </div>
          <div className="p-4 rounded-lg bg-[#141720] border border-[#1E2330]">
            <span className="text-xs text-gray-400 block mb-1">
              Asia Pacific
            </span>
            <div className="text-xl font-bold text-white">
              $11.40{" "}
              <span className="text-xs text-emerald-400 font-normal">
                (+$1.90)
              </span>
            </div>
            <span className="text-[11px] text-gray-500 mt-1 block">
              Fastest subscriber growth
            </span>
          </div>
          <div className="p-4 rounded-lg bg-[#141720] border border-[#1E2330]">
            <span className="text-xs text-gray-400 block mb-1">
              Latin America
            </span>
            <div className="text-xl font-bold text-white">
              $13.10{" "}
              <span className="text-xs text-emerald-400 font-normal">
                (+$0.60)
              </span>
            </div>
            <span className="text-[11px] text-gray-500 mt-1 block">
              Stable retention trajectory
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
