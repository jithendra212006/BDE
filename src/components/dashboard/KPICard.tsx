'use client';

import React from 'react';
import { KPIMetric } from '@/types/analytics';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  changePercentage: number;
  isPositive?: boolean;
  periodText?: string;
}

export default function KPICard({
  label,
  value,
  changePercentage,
  isPositive = true,
  periodText = 'vs last month',
}: KPICardProps) {
  return (
    <div className="card-clean card-clean-hover p-6 flex flex-col justify-between">
      <span className="text-xs font-medium text-gray-400 tracking-normal">
        {label}
      </span>

      <div className="my-3">
        <span className="text-3xl font-bold tracking-tight text-white font-sans">
          {value}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs">
        <span
          className={cn(
            'inline-flex items-center gap-0.5 font-medium',
            isPositive ? 'text-emerald-400' : 'text-rose-400'
          )}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          {changePercentage > 0 ? `+${changePercentage}%` : `${changePercentage}%`}
        </span>
        <span className="text-gray-500">{periodText}</span>
      </div>
    </div>
  );
}
