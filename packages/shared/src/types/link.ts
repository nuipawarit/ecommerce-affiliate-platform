import type { Link } from './base';

export interface LinkWithRelations extends Link {
  product?: {
    id: string;
    title: string;
    imageUrl: string;
  };
  campaign?: {
    id: string;
    name: string;
    slug: string;
  };
  offer?: {
    id: string;
    marketplace: "LAZADA" | "SHOPEE";
    storeName: string;
    price: number;
  };
  _count?: {
    clicks: number;
  };
}

export interface CreateLinkDTO {
  productId: string;
  campaignId: string;
  offerId: string;
}

export interface LinksListResponse {
  links: LinkWithRelations[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LinkDetailResponse {
  link: LinkWithRelations;
}
