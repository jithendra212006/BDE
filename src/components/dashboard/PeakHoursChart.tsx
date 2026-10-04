'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { PeakHourDataPoint } from '@/types/analytics';
import { analyticsService } from '@/services/analyticsService';

export default function PeakHoursChart() {
  const [data, setData] = useState<PeakHourDataPoint[]>([]);

  useEffect(() => {
    analyticsService.getPeakViewingHours().then((res) => setData(res));
  }, []);

  return (
    <div className="card-clean p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white tracking-tight">
            Peak Viewing Hours
          </h3>
          <span className="text-xs text-red-400 font-medium">
            8 PM - 11 PM Prime
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          Hourly viewer concurrency curve throughout the day
        </p>
      </div>

      {/* Bar Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1C212E" vertical={false} />
            <XAxis
              dataKey="hour"
              stroke="#64748B"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748B"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as PeakHourDataPoint;
                  return (
                    <div className="recharts-default-tooltip">
                      <p className="recharts-tooltip-label">{item.hour}</p>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-400">Viewers:</span>
                          <span className="font-semibold text-white">
                            {(item.viewersCount / 1000000).toFixed(2)}M
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="viewersCount" radius={[3, 3, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-peak-${index}`}
                  fill={entry.isPeak ? '#E50914' : '#1F2430'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
