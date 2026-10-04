"use client";

import React from "react";
import TrendingContentSection from "@/components/dashboard/TrendingContentSection";
import CompletionRateRankings from "@/components/dashboard/CompletionRateRankings";
import { TrendingUp, Flame, Zap, Sparkles, Compass, Radio } from "lucide-react";

export default function TrendingPage() {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-surface-card via-surface-100 to-brand-950/20 border border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-600 shadow-glow-red text-white">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Algorithmic Trending & Velocity Matrix
            </h1>
            <p className="text-xs text-gray-400">
              Real-time stream acceleration vectors and machine learning
              popularity scoring models.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-surface-200 border border-surface-border text-brand-400">
            Viral Velocity: <strong>Active Model</strong>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-surface-200 border border-surface-border text-emerald-400">
            Telemetry Refresh: <strong>Every 60s</strong>
          </span>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 uppercase font-semibold">
              #1 Velocity Leader
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              The Last Signal
            </h3>
            <span className="text-xs text-brand-400 font-mono">
              +38.4% Concurrency Spike
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-brand-600/10 text-brand-500">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 uppercase font-semibold">
              Breakout Sleeper Hit
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              Tokyo Monolith
            </h3>
            <span className="text-xs text-emerald-400 font-mono">
              +32.7% Global Surge
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 uppercase font-semibold">
              Social Buzz Correlation
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              0.92 Pearson Index
            </h3>
            <span className="text-xs text-cyan-400 font-mono">
              High Organic Resonance
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Radio className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-surface-border flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 uppercase font-semibold">
              Recommendation CTR
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              14.8% Click-Through
            </h3>
            <span className="text-xs text-purple-400 font-mono">
              Personalized Carousels
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
            <Compass className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <TrendingContentSection />

      {/* Completion Rankings */}
      <CompletionRateRankings />
    </div>
  );
}
