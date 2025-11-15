import type { Campaign, CampaignProduct } from './base';
import { CampaignStatus } from './base';

export { CampaignStatus };

export interface CampaignWithRelations extends Campaign {
  campaignProducts?: Array<{
    product: {
      id: string;
      title: string;
      imageUrl: string;
      offers?: Array<{
        id: string;
        marketplace: "LAZADA" | "SHOPEE";
        storeName: string;
        price: number;
        url: string;
      }>;
    };
  }>;
  links?: Array<{
    id: string;
    shortCode: string;
    targetUrl: string;
    _count?: {
      clicks: number;
    };
  }>;
  _count?: {
    links: number;
    campaignProducts: number;
  };
}

export interface CreateCampaignDTO {
  name: string;
  slug: string;
  description?: string | null;
  status?: CampaignStatus;
  utmCampaign: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  productIds?: string[];
}

export interface UpdateCampaignDTO {
  name?: string;
  slug?: string;
  description?: string | null;
  status?: CampaignStatus;
  utmCampaign?: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  productIds?: string[];
}

export interface CampaignsListResponse {
  campaigns: CampaignWithRelations[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CampaignDetailResponse {
  campaign: CampaignWithRelations;
}
