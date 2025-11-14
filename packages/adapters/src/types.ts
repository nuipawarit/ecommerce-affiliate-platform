export interface MarketplaceProduct {
  title: string;
  imageUrl: string;
  storeName: string;
  price: number;
  marketplace: 'lazada' | 'shopee';
  url: string;
}

export interface IMarketplaceAdapter {
  fetchProduct(url: string): Promise<MarketplaceProduct>;
  searchProducts(keyword: string): Promise<MarketplaceProduct[]>;
}
