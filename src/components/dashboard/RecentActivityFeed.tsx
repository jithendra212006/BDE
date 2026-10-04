"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Radio,
  Clock,
  TrendingUp,
  Zap,
  CheckCircle,
  Database,
  ArrowRight,
} from "lucide-react";
import { RecentActivityEvent } from "@/types/analytics";
import { analyticsService } from "@/services/analyticsService";
import { cn } from "@/lib/utils";

const typeIconMap = {
  stream_surge: Zap,
  milestone: CheckCircle,
  genre_shift: TrendingUp,
  subscription: Activity,
  pipeline_sync: Database,
};

export default function RecentActivityFeed() {
  const [events, setEvents] = useState<RecentActivityEvent[]>([]);

  useEffect(() => {
    analyticsService.getRecentActivity().then((res) => setEvents(res));
  }, []);

  return (
    <div className="glass-card rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-surface-border/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-600/10 border border-brand-500/30 text-brand-500">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Recent Streaming Activity
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Live platform telemetry & automated ingestion events
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-gray-400 bg-surface-100 px-2 py-1 rounded border border-surface-border">
          Live Feed
        </span>
      </div>

      {/* Events Stream */}
      <div className="space-y-3 my-3">
        {events.map((event) => {
          const Icon = typeIconMap[event.type] || Activity;
          return (
            <div
              key={event.id}
              className="p-3 rounded-lg bg-surface-100/40 hover:bg-surface-100 border border-surface-border/40 hover:border-surface-border transition-all flex items-start gap-3 group"
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-surface-200 border border-surface-border text-brand-400 shrink-0 mt-0.5 group-hover:border-brand-500/40 transition-colors">
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors truncate">
                    {event.title}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 whitespace-nowrap">
                    {event.timeAgo}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>
                {event.metricBadge && (
                  <span className="inline-block mt-1.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-600/10 text-brand-400 border border-brand-500/20">
                    {event.metricBadge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-2 pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs text-gray-400">
        <span>
          Pipeline Status:{" "}
          <strong className="text-emerald-400">Streaming Stream Active</strong>
        </span>
        <span className="text-[11px] font-mono text-gray-500">
          Latency &lt; 200ms
        </span>
      </div>
    </div>
  );
}
