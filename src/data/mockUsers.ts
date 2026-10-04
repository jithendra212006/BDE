import { User, SubscriptionAnalytics, DeviceAnalytics, CountryAnalytics } from '../types/analytics';

export const mockUsersList: User[] = [
  {
    userId: 'usr-89201',
    country: 'USA',
    subscriptionTier: 'Premium',
    primaryDevice: 'Smart TV',
    totalWatchHours: 248.5,
    signupDate: '2022-04-15',
    lastActive: '2024-11-20T21:40:00Z',
  },
  {
    userId: 'usr-89202',
    country: 'India',
    subscriptionTier: 'Standard',
    primaryDevice: 'Mobile',
    totalWatchHours: 194.2,
    signupDate: '2023-01-10',
    lastActive: '2024-11-20T22:15:00Z',
  },
  {
    userId: 'usr-89203',
    country: 'UK',
    subscriptionTier: 'Premium',
    primaryDevice: 'Laptop',
    totalWatchHours: 312.0,
    signupDate: '2021-11-04',
    lastActive: '2024-11-20T20:05:00Z',
  },
  {
    userId: 'usr-89204',
    country: 'Japan',
    subscriptionTier: 'Standard',
    primaryDevice: 'Tablet',
    totalWatchHours: 165.8,
    signupDate: '2023-07-22',
    lastActive: '2024-11-20T23:30:00Z',
  },
  {
    userId: 'usr-89205',
    country: 'Germany',
    subscriptionTier: 'Basic',
    primaryDevice: 'Smart TV',
    totalWatchHours: 89.4,
    signupDate: '2024-02-18',
    lastActive: '2024-11-20T19:50:00Z',
  },
  {
    userId: 'usr-89206',
    country: 'Canada',
    subscriptionTier: 'Premium',
    primaryDevice: 'Smart TV',
    totalWatchHours: 410.2,
    signupDate: '2021-06-12',
    lastActive: '2024-11-20T22:45:00Z',
  },
  {
    userId: 'usr-89207',
    country: 'Australia',
    subscriptionTier: 'Standard',
    primaryDevice: 'Mobile',
    totalWatchHours: 142.1,
    signupDate: '2023-09-05',
    lastActive: '2024-11-20T21:10:00Z',
  },
  {
    userId: 'usr-89208',
    country: 'Brazil',
    subscriptionTier: 'Basic',
    primaryDevice: 'Mobile',
    totalWatchHours: 98.6,
    signupDate: '2024-05-19',
    lastActive: '2024-11-20T22:00:00Z',
  },
];

/**
 * Mathematically Consistent Subscription Analytics:
 * Total Paid Subscribers = 18,200,000 (18.2M)
 * Basic: 30% (5,460,000) @ $7.99/mo  -> $43,625,400
 * Standard: 50% (9,100,000) @ $11.99/mo -> $109,109,000
 * Premium: 20% (3,640,000) @ $16.99/mo  -> $61,843,600
 * Sum Percentages = 100.0%
 * Sum Subscribers = 18,200,000
 * Total Monthly Recurring Revenue (MRR) = $214,578,000 ($214.6M)
 * ARPU = $214,578,000 / 18,200,000 = $11.79 / mo
 * ARR = $214,578,000 * 12 = $2.575B
 */
export const mockSubscriptionStats: SubscriptionAnalytics[] = [
  {
    tier: 'Basic',
    subscribers: 5460000,
    percentage: 30.0,
    monthlyPrice: 7.99,
    estimatedRevenue: 43625400,
    growthRate: 6.4,
    color: '#64748B',
  },
  {
    tier: 'Standard',
    subscribers: 9100000,
    percentage: 50.0,
    monthlyPrice: 11.99,
    estimatedRevenue: 109109000,
    growthRate: 10.8,
    color: '#3B82F6',
  },
  {
    tier: 'Premium',
    subscribers: 3640000,
    percentage: 20.0,
    monthlyPrice: 16.99,
    estimatedRevenue: 61843600,
    growthRate: 16.2,
    color: '#E50914',
  },
];

/**
 * Mathematically Consistent Device Distribution:
 * Sum Percentages = 44.5% + 31.2% + 14.8% + 7.1% + 2.4% = 100.0%
 * Total Watch Hours = 63.4M + 44.5M + 21.1M + 10.1M + 3.5M = 142.6M hrs (Exact match to platform total)
 */
export const mockDeviceStats: DeviceAnalytics[] = [
  {
    device: 'Smart TV',
    percentage: 44.5,
    totalStreams: 28660000,
    watchHours: 63400000,
    color: '#E50914',
    iconName: 'Tv',
  },
  {
    device: 'Mobile',
    percentage: 31.2,
    totalStreams: 20090000,
    watchHours: 44500000,
    color: '#3B82F6',
    iconName: 'Smartphone',
  },
  {
    device: 'Laptop',
    percentage: 14.8,
    totalStreams: 9530000,
    watchHours: 21100000,
    color: '#10B981',
    iconName: 'Laptop',
  },
  {
    device: 'Tablet',
    percentage: 7.1,
    totalStreams: 4570000,
    watchHours: 10100000,
    color: '#F59E0B',
    iconName: 'Tablet',
  },
  {
    device: 'Other',
    percentage: 2.4,
    totalStreams: 1550000,
    watchHours: 3500000,
    color: '#8B5CF6',
    iconName: 'Cast',
  },
];

/**
 * Mathematically Consistent Geographic Distribution:
 * Total Unique Viewers = 24,800,000 (24.8M)
 * Total Platform Watch Hours = 142.6M hrs
 * Sum Percentages = 38.4 + 24.1 + 11.2 + 7.8 + 6.4 + 5.1 + 4.2 + 2.8 = 100.0%
 * Sum Viewers = 9.52 + 5.98 + 2.78 + 1.93 + 1.59 + 1.26 + 1.04 + 0.70 = 24.80M (Exact)
 * Sum Watch Hours = 54.8 + 34.4 + 16.0 + 11.1 + 9.1 + 7.3 + 6.0 + 3.9 = 142.6M hrs (Exact)
 */
export const mockCountryStats: CountryAnalytics[] = [
  {
    country: 'India',
    countryCode: 'IN',
    flagEmoji: '🇮🇳',
    viewerCount: 9520000,
    percentage: 38.4,
    watchHours: 54800000,
    growthRate: 24.6,
  },
  {
    country: 'USA',
    countryCode: 'US',
    flagEmoji: '🇺🇸',
    viewerCount: 5980000,
    percentage: 24.1,
    watchHours: 34400000,
    growthRate: 8.2,
  },
  {
    country: 'UK',
    countryCode: 'GB',
    flagEmoji: '🇬🇧',
    viewerCount: 2780000,
    percentage: 11.2,
    watchHours: 16000000,
    growthRate: 12.1,
  },
  {
    country: 'Canada',
    countryCode: 'CA',
    flagEmoji: '🇨🇦',
    viewerCount: 1930000,
    percentage: 7.8,
    watchHours: 11100000,
    growthRate: 9.5,
  },
  {
    country: 'Japan',
    countryCode: 'JP',
    flagEmoji: '🇯🇵',
    viewerCount: 1590000,
    percentage: 6.4,
    watchHours: 9100000,
    growthRate: 15.8,
  },
  {
    country: 'Germany',
    countryCode: 'DE',
    flagEmoji: '🇩🇪',
    viewerCount: 1260000,
    percentage: 5.1,
    watchHours: 7300000,
    growthRate: 6.7,
  },
  {
    country: 'Australia',
    countryCode: 'AU',
    flagEmoji: '🇦🇺',
    viewerCount: 1040000,
    percentage: 4.2,
    watchHours: 6000000,
    growthRate: 11.0,
  },
  {
    country: 'Brazil',
    countryCode: 'BR',
    flagEmoji: '🇧🇷',
    viewerCount: 700000,
    percentage: 2.8,
    watchHours: 3900000,
    growthRate: 19.4,
  },
];
