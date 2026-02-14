
export interface Publication {
  id: string;
  title: string;
  description: string;
  cover_url: string;
  flipbook_url: string;
  category: string;
  year: string;
  publish_date: string;
  is_latest: boolean;
  views: number;
}

export interface Notice {
  id: string;
  content: string;
  active: boolean;
  created_at: string;
}

export interface VisitorLog {
  id: string;
  time: string;
  device: string;
  token: string;
  platform: string;
  path: string;
}

export interface AnalyticsData {
  totalVisitors: number;
  todayVisits: number;
  totalPublications: number;
  popularMagazine: string;
  trends: { date: string; count: number }[];
  deviceDistribution: { name: string; value: number }[];
}

export interface SiteSettings {
  logoUrl: string;
  headline: string;
  heroDescription: string;
  footerText: string;
  contactInfo: string;
  mobileSyncLink: string;
  backgroundPatternUrl: string;
  divineImageUrl: string;
}
