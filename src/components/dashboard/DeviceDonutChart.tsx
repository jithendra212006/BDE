'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { DeviceAnalytics } from '@/types/analytics';
import { analyticsService } from '@/services/analyticsService';

const cleanDeviceColors = ['#E50914', '#3B82F6', '#10B981', '#F59E0B'];

export default function DeviceDonutChart() {
  const [data, setData] = useState<DeviceAnalytics[]>([]);

  useEffect(() => {
    analyticsService.getDeviceAnalytics().then((res) => {
      // Filter out 'Other' to keep TV, Mobile, Laptop, Tablet clean and focused
      const mainDevices = res.filter((item) => item.device !== 'Other');
      setData(mainDevices);
    });
  }, []);

  return (
    <div className="card-clean p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="pb-4">
        <h3 className="text-base font-semibold text-white tracking-tight">
          Viewing by Device
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Audience share across streaming hardware
        </p>
      </div>

      {/* Donut & Clean Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-6 my-auto pt-2">
        {/* Donut Chart */}
        <div className="h-56 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as DeviceAnalytics;
                    return (
                      <div className="recharts-default-tooltip">
                        <p className="recharts-tooltip-label">{item.device}</p>
                        <div className="text-xs">
                          <span className="text-gray-400">Share: </span>
                          <span className="font-semibold text-white">{item.percentage}%</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="percentage"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`clean-dev-${index}`}
                    fill={cleanDeviceColors[index % cleanDeviceColors.length]}
                    stroke="#13161F"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-white">44.5%</span>
            <span className="text-[11px] text-gray-400">Smart TV</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.device} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: cleanDeviceColors[index % cleanDeviceColors.length] }}
                />
                <span className="text-gray-300 font-medium">{item.device}</span>
              </div>
              <span className="font-semibold text-white">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
