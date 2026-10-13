
export type SubscriptionTier = 'Basic' | 'Standard' | 'Premium';

export type DeviceType =
  | 'Smart TV'
  | 'Mobile'
  | 'Laptop'
  | 'Tablet'
  | 'Other';

export type GenreType =
  | 'Drama'
  | 'Action'
  | 'Comedy'
  | 'Thriller'
  | 'Sci-Fi'
  | 'Horror'
  | 'Documentary'
  | 'Anime';

export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';

export interface User {
  userId: string;
  country: string;
  subscriptionTier: SubscriptionTier;
  primaryDevice: DeviceType;
  totalWatchHours: number;
  signupDate: string;
  lastActive: string;
}

export interface ContentItem {
  id: string;
  title: string;
  genre: GenreType;
  releaseYear: number;
  durationMinutes: number;
  rating: number;
  ageRating: string;
  totalViews: number;
  totalWatchHours: number;
  completionRate: number;
  trendScore: number;
  posterColor: string;
  description: string;
  isTrending: boolean;
  rank?: number;
  leadActors?: string[];
  director?: string;
  seasonsCount?: number;
}

export interface ViewingSession {
  sessionId: string;
  userId: string;
  contentId: string;
  contentTitle: string;
  deviceType: DeviceType;
  country: string;
  startTime: string;
  durationMinutes: number;
  completedPercentage: number;
  bufferedEventsCount: number;
  averageBitrateMbps: number;
}

export interface KPIMetric {
  id: string;
  label: string;
  value: string | number;

  // Support both existing KPI data and API adapter fields
  rawValue?: number;
  numericValue?: number;
  unit?: string;

  changePercentage: number;
  isPositive: boolean;

  // Existing and API adapter period fields
  comparisonPeriod?: string;
  periodText?: string;

  // Optional display metadata
  sparklineData?: number[];
  iconName?: string;
  description?: string;
}

export interface WatchTimeDataPoint {
  date: string;
  formattedDate: string;
  watchHours: number;
  activeStreams: number;
  uniqueViewers: number;
}

export interface GenreAnalytics {
  genre: GenreType;
  watchHours: number;
  totalStreams: number;
  sharePercentage: number;
  avgCompletionRate: number;
  topTitle: string;
  color: string;
}

export interface PeakHourDataPoint {
  hour: string;
  hour24: number;
  viewersCount: number;
  streamsCount: number;
  bandwidthGbps: number;
  isPeak: boolean;
}

export interface DeviceAnalytics {
  device: DeviceType;
  percentage: number;
  totalStreams: number;
  watchHours: number;
  color: string;
  iconName: string;
}

export interface CountryAnalytics {
  country: string;
  countryCode: string;
  flagEmoji: string;
  viewerCount: number;
  percentage: number;
  watchHours: number;
  growthRate: number;
}

export interface RetentionCohort {
  period: string;
  retentionRate: number;
  returningUsers: number;
  dropOffRate: number;
  industryBenchmark: number;
}

export interface SubscriptionAnalytics {
  tier: SubscriptionTier;
  subscribers: number;
  percentage: number;
  monthlyPrice: number;
  estimatedRevenue: number;
  growthRate: number;
  color: string;
}

export interface CompletionRateItem {
  id: string;
  title: string;
  genre: GenreType;
  completionRate: number;
  dropOffPoint: string;
  avgRewatchRate: number;
}

export interface RecentActivityEvent {
  id: string;
  timestamp: string;
  timeAgo: string;
  type:
    | 'stream_surge'
    | 'milestone'
    | 'genre_shift'
    | 'subscription'
    | 'pipeline_sync';
  title: string;
  description: string;
  highlightText?: string;
  metricBadge?: string;
}

export interface BigDataPipelineStage {
  step: number;
  name: string;
  technology: string;
  role: string;
  status: 'active' | 'synced' | 'standby';
  description: string;
  metrics: {
    label: string;
    value: string;
  }[];
  iconName: string;
}

export interface PipelineStatus {
  clusterStatus: 'HEALTHY' | 'PROCESSING' | 'DEGRADED';
  hdfsStorageUsed: string;
  totalRecordsProcessed: string;
  hivePartitionCount: number;
  sparkJobExecTime: string;
  lastSyncTimestamp: string;
  activeSparkWorkers: number;
}
