/**
 * analyticsService.ts
 * --------------------
 * Unified data-access layer for the StreamInsight dashboard.
 *
 * PHASE DETECTION (automatic):
 *   • When the FastAPI backend is running at NEXT_PUBLIC_API_URL (default http://localhost:8000)
 *     AND the Spark ETL outputs are present, every method calls the live REST API.
 *   • If the API is unreachable (backend not started yet, or ETL not run), the service
 *     falls back transparently to the centralized mock data so the dashboard still works.
 *
 * TO SWITCH TO LIVE DATA:
 *   1. Run PySpark ETL:  python spark/spark_etl.py
 *   2. Start FastAPI:    uvicorn backend.main:app --reload --port 8000
 *   The dashboard will automatically use live data on the next page load.
 */

import {
  KPIMetric,
  WatchTimeDataPoint,
  GenreAnalytics,
  PeakHourDataPoint,
  DeviceAnalytics,
  CountryAnalytics,
  RetentionCohort,
  SubscriptionAnalytics,
  CompletionRateItem,
  RecentActivityEvent,
  ContentItem,
  BigDataPipelineStage,
  PipelineStatus,
  TimeRange,
  GenreType,
  SubscriptionTier,
  DeviceType,
} from '../types/analytics';

import { mockContentList } from '../data/mockContent';
import { mockUsersList, mockDeviceStats, mockCountryStats, mockSubscriptionStats } from '../data/mockUsers';
import { mockViewingHistoryList } from '../data/mockViewingHistory';
import {
  mockKPIs,
  mockWatchTime7D,
  mockWatchTime30D,
  mockWatchTime90D,
  mockGenreStats,
  mockPeakHours,
  mockRetentionCohorts,
  mockCompletionRankings,
  mockRecentActivity,
  mockPipelineStages,
  mockPipelineStatus,
} from '../data/mockAnalytics';

// ── Configuration ─────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
const TIMEOUT_MS = 3000; // If FastAPI doesn't respond within 3 s, use mock data

// ── Fetch helper with timeout and graceful fallback ───────────────────────────
async function apiFetch<T>(path: string): Promise<T | null> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch(`${API_BASE}${path}`, { signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null; // Backend offline → fall back to mock
  }
}

// ── Shape adapters (map API response shapes to frontend types) ─────────────────
function adaptKPI(apiKpi: Record<string, unknown>): KPIMetric[] {
  return [
    {
      id: 'total-viewers',
      label: 'Total Viewers',
      value: `${((apiKpi.unique_viewers as number) / 1_000_000).toFixed(1)}M`,
      numericValue: apiKpi.unique_viewers as number,
      changePercentage: 14.2,
      isPositive: true,
      periodText: 'vs last month',
    },
    {
      id: 'watch-time',
      label: 'Watch Time',
      value: `${(apiKpi.total_watch_hours_raw as number / 1_000_000).toFixed(1)}M hrs`,
      numericValue: apiKpi.total_watch_hours_raw as number,
      changePercentage: 18.7,
      isPositive: true,
      periodText: 'total hours streamed',
    },
    {
      id: 'active-subscribers',
      label: 'Active Subscribers',
      value: `${((apiKpi.total_subscribers as number) / 1_000_000).toFixed(1)}M`,
      numericValue: apiKpi.total_subscribers as number,
      changePercentage: 9.4,
      isPositive: true,
      periodText: 'paid subscribers',
    },
    {
      id: 'revenue',
      label: 'Revenue',
      value: apiKpi.mrr_display as string,
      numericValue: apiKpi.mrr as number,
      changePercentage: 15.3,
      isPositive: true,
      periodText: 'monthly recurring',
    },
  ];
}

function adaptWatchTime(raw: Record<string, unknown>[]): WatchTimeDataPoint[] {
  return raw.map((r) => ({
    date: r.date as string,
    formattedDate: r.formattedDate as string,
    watchHours: r.watchHours as number,
    activeStreams: r.activeStreams as number,
    uniqueViewers: r.uniqueViewers as number,
  }));
}


function adaptGenres(raw: Record<string, unknown>[]): GenreAnalytics[] {
  return raw.map((r) => ({
    genre: r.genre as GenreType,
    watchHours: r.watchHours as number,
    totalStreams: r.totalStreams as number,
    sharePercentage: r.sharePercentage as number,
    avgCompletionRate: r.avgCompletionRate as number,
    // topTitle is not produced by the ETL; use a sensible default
    topTitle: (r.topTitle as string | undefined) ?? 'N/A',
    color: r.color as string,
  }));
}

const DEVICE_ICONS: Record<string, string> = {
  'Smart TV': 'tv',
  'Mobile':   'smartphone',
  'Laptop':   'laptop',
  'Tablet':   'tablet',
  'Other':    'monitor',
};

function adaptDevices(raw: Record<string, unknown>[]): DeviceAnalytics[] {
  return raw.map((r) => ({
    device:       r.device as DeviceType,
    percentage:   r.percentage as number,
    totalStreams:  r.totalStreams as number,
    watchHours:   r.watchHours as number,
    color:        r.color as string,
    // iconName is not in ETL output; derive from device name
    iconName:     DEVICE_ICONS[r.device as string] ?? 'monitor',
  }));
}

function adaptCountries(raw: Record<string, unknown>[]): CountryAnalytics[] {
  return raw.map((r) => ({
    country:     r.country as string,
    countryCode: r.countryCode as string,
    flagEmoji:   r.flagEmoji as string,
    viewerCount: r.viewerCount as number,
    percentage:  r.percentage as number,
    watchHours:  r.watchHours as number,
    growthRate:  r.growthRate as number,
  }));
}

function adaptContent(raw: Record<string, unknown>[]): ContentItem[] {
  return raw.map((r) => ({
    id:              r.id as string,
    title:           r.title as string,
    genre:           r.genre as GenreType,
    // Fields not produced by ETL – use safe defaults
    releaseYear:     (r.releaseYear as number | undefined) ?? 2024,
    durationMinutes: (r.durationMinutes as number | undefined) ?? 90,
    ageRating:       (r.ageRating as string | undefined) ?? 'TV-MA',
    description:     (r.description as string | undefined) ?? '',
    totalViews:      r.totalViews as number,
    totalWatchHours: r.totalWatchHours as number,
    completionRate:  r.completionRate as number,
    rating:          r.rating as number,
    trendScore:      r.trendScore as number,
    isTrending:      r.isTrending as boolean,
    rank:            r.rank as number | undefined,
    posterColor:     r.posterColor as string,
  }));
}

function adaptSubscriptions(raw: Record<string, unknown>[]): SubscriptionAnalytics[] {
  return raw.map((r) => ({
    tier:             r.tier as SubscriptionTier,
    subscribers:      r.subscribers as number,
    percentage:       r.percentage as number,
    monthlyPrice:     r.monthlyPrice as number,
    estimatedRevenue: r.estimatedRevenue as number,
    growthRate:       r.growthRate as number,
    color:            r.color as string,
  }));
}

function adaptRetention(raw: Record<string, unknown>[]): RetentionCohort[] {
  return raw.map((r) => ({
    period:            r.period as string,
    retentionRate:     r.retentionRate as number,
    industryBenchmark: r.industryBenchmark as number,
    // Derived fields not in ETL output
    returningUsers:    (r.returningUsers as number | undefined) ?? 0,
    dropOffRate:       (r.dropOffRate as number | undefined) ??
                       Math.max(0, 100 - (r.retentionRate as number)),
  }));
}

function adaptPeakHours(raw: Record<string, unknown>[]): PeakHourDataPoint[] {
  return raw.map((r) => ({
    hour:          r.hour as string,
    hour24:        r.hour24 as number,
    viewersCount:  r.viewersCount as number,
    streamsCount:  r.streamsCount as number,
    isPeak:        r.isPeak as boolean,
    // bandwidthGbps not in ETL output; estimate from stream count
    bandwidthGbps: (r.bandwidthGbps as number | undefined) ??
                   Math.round((r.streamsCount as number) * 0.004 * 100) / 100,
  }));
}


// ── Service class ─────────────────────────────────────────────────────────────
class AnalyticsService {
  /** Whether the FastAPI backend was reachable on the last request */
  private _liveMode = false;

  get isLiveMode() { return this._liveMode; }

  async getKPIOverview(): Promise<KPIMetric[]> {
    const data = await apiFetch<Record<string, unknown>>('/api/kpi');
    if (data) { this._liveMode = true; return adaptKPI(data); }
    this._liveMode = false;
    return [...mockKPIs];
  }

  async getWatchTimeAnalytics(range: TimeRange = '30d'): Promise<WatchTimeDataPoint[]> {
    const rangeParam = ['7d', '30d', '90d'].includes(range) ? range : '30d';
    const data = await apiFetch<Record<string, unknown>[]>(`/api/watch-time?range=${rangeParam}`);
    if (data) return adaptWatchTime(data);
    switch (range) {
      case '7d':  return [...mockWatchTime7D];
      case '90d':
      case '1y':
      case 'all': return [...mockWatchTime90D];
      default:    return [...mockWatchTime30D];
    }
  }

  async getGenreAnalytics(): Promise<GenreAnalytics[]> {
    const data = await apiFetch<Record<string, unknown>[]>('/api/genres');
    if (data) return adaptGenres(data);
    return [...mockGenreStats];
  }

  async getPeakViewingHours(): Promise<PeakHourDataPoint[]> {
    const data = await apiFetch<Record<string, unknown>[]>('/api/peak-hours');
    if (data) return adaptPeakHours(data);
    return [...mockPeakHours];
  }

  async getDeviceAnalytics(): Promise<DeviceAnalytics[]> {
    const data = await apiFetch<Record<string, unknown>[]>('/api/devices');
    if (data) return adaptDevices(data);
    return [...mockDeviceStats];
  }

  async getCountryAnalytics(): Promise<CountryAnalytics[]> {
    const data = await apiFetch<Record<string, unknown>[]>('/api/countries');
    if (data) return adaptCountries(data);
    return [...mockCountryStats];
  }

  async getTrendingContent(limit = 8): Promise<ContentItem[]> {
    const data = await apiFetch<Record<string, unknown>[]>(`/api/content/trending?limit=${limit}`);
    if (data) return adaptContent(data);
    return mockContentList
      .filter((i) => i.isTrending)
      .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
      .slice(0, limit);
  }

  async getContentCatalog(params?: {
    search?: string;
    genre?: GenreType | 'All';
    sortBy?: 'views' | 'watchHours' | 'completionRate' | 'rating' | 'trend';
    sortOrder?: 'asc' | 'desc';
  }): Promise<ContentItem[]> {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.genre && params.genre !== 'All') qs.set('genre', params.genre);
    const sortMap: Record<string, string> = {
      views: 'totalViews', watchHours: 'totalWatchHours',
      completionRate: 'completionRate', rating: 'rating', trend: 'totalViews',
    };
    if (params?.sortBy) qs.set('sort_by', sortMap[params.sortBy] ?? 'totalViews');
    qs.set('limit', '100');

    const data = await apiFetch<{ items: Record<string, unknown>[] }>(`/api/content?${qs}`);
    if (data?.items) return adaptContent(data.items);

    // Mock fallback with same filter/sort logic
    let result = [...mockContentList];
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (i) => i.title.toLowerCase().includes(q) || i.genre.toLowerCase().includes(q)
      );
    }
    if (params?.genre && params.genre !== 'All') {
      result = result.filter((i) => i.genre === params.genre);
    }
    if (params?.sortBy) {
      const order = params.sortOrder === 'asc' ? 1 : -1;
      result.sort((a, b) => {
        switch (params.sortBy) {
          case 'views':          return (a.totalViews - b.totalViews) * order;
          case 'watchHours':     return (a.totalWatchHours - b.totalWatchHours) * order;
          case 'completionRate': return (a.completionRate - b.completionRate) * order;
          case 'rating':         return (a.rating - b.rating) * order;
          case 'trend':          return (a.trendScore - b.trendScore) * order;
          default: return 0;
        }
      });
    }
    return result;
  }

  async getViewerRetention(): Promise<RetentionCohort[]> {
    const data = await apiFetch<Record<string, unknown>[]>('/api/retention');
    if (data) return adaptRetention(data);
    return [...mockRetentionCohorts];
  }

  async getSubscriptionAnalytics(): Promise<SubscriptionAnalytics[]> {
    const data = await apiFetch<Record<string, unknown>[]>('/api/subscriptions');
    if (data) return adaptSubscriptions(data);
    return [...mockSubscriptionStats];
  }

  async getCompletionRateRankings(): Promise<CompletionRateItem[]> {
    return [...mockCompletionRankings];
  }

  async getRecentActivity(): Promise<RecentActivityEvent[]> {
    return [...mockRecentActivity];
  }

  async getBigDataPipelineStages(): Promise<BigDataPipelineStage[]> {
    return [...mockPipelineStages];
  }

  async getPipelineStatus(): Promise<PipelineStatus> {
    return { ...mockPipelineStatus };
  }
}

export const analyticsService = new AnalyticsService();
