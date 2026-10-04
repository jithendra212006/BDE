'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TimeRange, WatchTimeDataPoint } from '@/types/analytics';
import { analyticsService } from '@/services/analyticsService';
import { cn } from '@/lib/utils';

interface WatchTimeChartProps {
  initialRange?: TimeRange;
}

export default function WatchTimeChart({ initialRange = '30d' }: WatchTimeChartProps) {
  const [range, setRange] = useState<TimeRange>(initialRange);
  const [data, setData] = useState<WatchTimeDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    analyticsService.getWatchTimeAnalytics(range).then((result) => {
      if (isMounted) {
        setData(result);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [range]);

  return (
    <div className="card-clean p-7">
      {/* Header & Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
        <div>
          <h2 className="text-base font-semibold text-white tracking-tight">
            Watch Time
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Total streaming hours across all content (in millions)
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 bg-[#141720] p-1 rounded-lg border border-[#1E2330] self-start sm:self-auto">
          {(['7d', '30d', '90d'] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                range === r
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-gray-200'
              )}
            >
              {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-80 w-full pt-2">
        {loading ? (
          <div className="h-full flex items-center justify-center text-gray-500 text-xs">
            Loading watch time data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cleanWatchTimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E50914" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#E50914" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C212E" vertical={false} />
              <XAxis
                dataKey="formattedDate"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}M`}
                dx={-4}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload as WatchTimeDataPoint;
                    return (
                      <div className="recharts-default-tooltip">
                        <p className="recharts-tooltip-label">{label}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-400">Watch Time:</span>
                          <span className="font-semibold text-white">{d.watchHours}M hrs</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="watchHours"
                name="Watch Hours"
                stroke="#E50914"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#cleanWatchTimeGradient)"
                activeDot={{ r: 5, fill: '#E50914', stroke: '#0D0F14', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
