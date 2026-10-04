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
import { GenreAnalytics } from '@/types/analytics';
import { analyticsService } from '@/services/analyticsService';

const allowedGenres = ['Drama', 'Action', 'Comedy', 'Thriller', 'Sci-Fi', 'Anime'];

export default function GenreAnalyticsChart() {
  const [data, setData] = useState<GenreAnalytics[]>([]);

  useEffect(() => {
    analyticsService.getGenreAnalytics().then((res) => {
      // Filter to the 6 core genres requested
      const filtered = res.filter((item) => allowedGenres.includes(item.genre));
      setData(filtered);
    });
  }, []);

  return (
    <div className="card-clean p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="pb-4">
        <h3 className="text-base font-semibold text-white tracking-tight">
          Popular Genres
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Viewing volume across top categories (Million hrs)
        </p>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1C212E" horizontal={false} />
            <XAxis
              type="number"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}M`}
            />
            <YAxis
              type="category"
              dataKey="genre"
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={65}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as GenreAnalytics;
                  return (
                    <div className="recharts-default-tooltip">
                      <p className="recharts-tooltip-label">{item.genre}</p>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-400">Watch Time:</span>
                          <span className="font-semibold text-white">{item.watchHours}M hrs</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-400">Share:</span>
                          <span className="font-semibold text-white">{item.sharePercentage}%</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="watchHours" radius={[0, 4, 4, 0]} barSize={16}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-genre-${index}`}
                  fill={index === 0 ? '#E50914' : '#2A3142'}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
