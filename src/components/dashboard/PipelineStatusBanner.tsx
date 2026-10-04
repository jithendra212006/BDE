'use client';

import React, { useEffect, useState } from 'react';

type Mode = 'live' | 'mock' | 'checking';

/**
 * PipelineStatusBanner
 * --------------------
 * Shows a small top-of-page pill indicating whether the dashboard is using
 * live data from the PySpark/FastAPI pipeline, or the local mock data fallback.
 * Hidden after 8 seconds in live mode to avoid clutter.
 */
export default function PipelineStatusBanner() {
  const [mode, setMode] = useState<Mode>('checking');

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    fetch(`${apiBase}/api/pipeline/status`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => setMode(data?.ready ? 'live' : 'mock'))
      .catch(() => setMode('mock'))
      .finally(() => clearTimeout(timeout));
  }, []);

  if (mode === 'checking') return null;

  const isLive = mode === 'live';

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium w-fit mb-6 ${
        isLive
          ? 'bg-emerald-950/60 border border-emerald-800/50 text-emerald-400'
          : 'bg-[#1A1D26] border border-[#1E2330] text-gray-400'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`}
      />
      {isLive
        ? 'Live data · PySpark ETL + FastAPI connected'
        : 'Mock data · Run Spark ETL + start FastAPI to connect live pipeline'}
    </div>
  );
}
