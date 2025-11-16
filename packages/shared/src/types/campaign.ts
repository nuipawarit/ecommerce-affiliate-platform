import type { Campaign, CampaignProduct } from './base';
import { CampaignStatus } from './base';
import type { ProductWithOffers } from './product';

export { CampaignStatus };
export type { Campaign, CampaignProduct };

export interface CampaignWithRelations extends Campaign {
  campaignProducts?: Array<{
    product: ProductWithOffers;
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
    clicks: number;
  };
}

export interface CreateCampaignDTO {
  name: string;
  slug: string;
  description?: string | null;
  status?: CampaignStatus;
  utmCampaign: string;
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
