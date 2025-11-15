export interface MarketplaceProduct {
  title: string;
  imageUrl: string;
  storeName: string;
  price: number;
  marketplace: 'lazada' | 'shopee';
  url: string;
  sku?: string;
}

export interface IMarketplaceAdapter {
  fetchProduct(url: string): Promise<MarketplaceProduct>;
  fetchProductBySku(sku: string): Promise<MarketplaceProduct>;
  searchProducts(keyword: string): Promise<MarketplaceProduct[]>;
}
