import type { Product, Offer } from './base';
import { Marketplace } from './base';

export { Marketplace };

export interface ProductWithOffers extends Product {
  offers: Offer[];
}

export interface ProductWithCounts extends ProductWithOffers {
  _count?: {
    links: number;
    campaignProducts: number;
  };
}

export interface MarketplaceProduct {
  title: string;
  imageUrl: string;
  storeName: string;
  price: number;
  marketplace: Marketplace;
  url: string;
  sku?: string;
}

export interface CreateProductDTO {
  url?: string;
  sku?: string;
  marketplace: Marketplace;
}

export interface UpdateProductDTO {
  title?: string;
  description?: string | null;
  imageUrl?: string;
}

export interface SearchProductDTO {
  url?: string;
  sku?: string;
}

export interface ProductsListResponse {
  products: ProductWithCounts[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductDetailResponse {
  product: ProductWithCounts;
}

export interface SearchProductsResponse {
  products: MarketplaceProduct[];
}
