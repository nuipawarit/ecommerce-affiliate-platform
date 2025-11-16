export interface AnalyticsOverview {
  totalClicks: number;
  totalLinks: number;
  totalCampaigns: number;
  totalProducts: number;
  clicksByMarketplace: Record<string, number>;
  clicksByDay: Array<{
    date: string;
    clicks: number;
  }>;
  topCampaigns: Array<{
    id: string;
    name: string;
    clicks: number;
  }>;
}

export interface DashboardData extends AnalyticsOverview {
  topProducts: Array<{
    id: string;
    title: string;
    imageUrl?: string;
    clicks: number;
  }>;
}

export interface CampaignAnalytics {
  campaignId: string;
  totalClicks: number;
  totalLinks: number;
  clicksByProduct: Array<{
    productId: string;
    productTitle: string;
    clicks: number;
  }>;
  clicksByMarketplace: Record<string, number>;
  clicksOverTime: Array<{
    date: string;
    clicks: number;
  }>;
}

export interface ProductAnalytics {
  productId: string;
  totalClicks: number;
  totalLinks: number;
  clicksByCampaign: Array<{
    campaignId: string;
    campaignName: string;
    clicks: number;
  }>;
  clicksByMarketplace: Record<string, number>;
  averageClickRate: number;
}

export interface AnalyticsOverviewResponse {
  overview: AnalyticsOverview;
}

export interface CampaignAnalyticsResponse {
  analytics: CampaignAnalytics;
}

export interface ProductAnalyticsResponse {
  analytics: ProductAnalytics;
}
