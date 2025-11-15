# @repo/adapters

Marketplace adapters for Lazada and Shopee integration. Provides a unified interface for fetching product data and searching products across different e-commerce platforms.

## Features

- ✅ **Unified Interface** - `IMarketplaceAdapter` interface for consistent integration
- ✅ **Lazada Support** - Parse URLs and fetch product data from Lazada Thailand
- ✅ **Shopee Support** - Parse URLs (both SEO and simple formats) and fetch product data
- ✅ **Mock Data** - Realistic Thai e-commerce product mock data for development
- ✅ **Search Functionality** - Search products by keyword across marketplaces
- ✅ **Type-Safe** - Full TypeScript support with explicit types
- ✅ **Well-Tested** - 86.58% line coverage with comprehensive unit tests

## Installation

From the monorepo root:

```bash
bun install
```

## Usage

### Fetch Product from URL

```typescript
import { LazadaAdapter, ShopeeAdapter } from '@repo/adapters';

// Lazada
const lazadaAdapter = new LazadaAdapter();
const lazadaProduct = await lazadaAdapter.fetchProduct(
  'https://www.lazada.co.th/products/matcha-powder-i123456.html'
);

console.log(lazadaProduct);
// {
//   title: 'Matcha Powder Premium Grade - Japanese Green Tea 100g',
//   imageUrl: 'https://images.unsplash.com/photo-...',
//   storeName: 'Organic Tea Shop - Lazada',
//   price: 299,
//   marketplace: 'lazada',
//   url: 'https://www.lazada.co.th/products/matcha-powder-i123456.html'
// }

// Shopee (supports both URL formats)
const shopeeAdapter = new ShopeeAdapter();
const shopeeProduct = await shopeeAdapter.fetchProduct(
  'https://shopee.co.th/Matcha-Powder-i.123456.789012'
);
// or
const shopeeProduct2 = await shopeeAdapter.fetchProduct(
  'https://shopee.co.th/product/123456/789012'
);
```

### Search Products

```typescript
import { LazadaAdapter } from '@repo/adapters';

const adapter = new LazadaAdapter();
const results = await adapter.searchProducts('coffee');

console.log(results);
// [
//   {
//     title: 'Coffee Beans Arabica Premium 1kg - Thai Highland',
//     price: 450,
//     marketplace: 'lazada',
//     ...
//   },
//   // ... up to 5 results
// ]
```

### Error Handling

```typescript
import { LazadaAdapter, MarketplaceError } from '@repo/adapters';

const adapter = new LazadaAdapter();

try {
  const product = await adapter.fetchProduct('https://invalid-url.com');
} catch (error) {
  if (error instanceof MarketplaceError) {
    console.error(`Marketplace: ${error.marketplace}`);
    console.error(`Message: ${error.message}`);
  }
}
```

## Supported URL Formats

### Lazada

```
https://www.lazada.co.th/products/[product-name]-i[product_id].html
https://lazada.co.th/products/[product-name]-i[product_id].html
https://www.lazada.com/products/[product-name]-i[product_id].html
```

**Examples:**
- `https://www.lazada.co.th/products/matcha-powder-i123456.html`
- `https://lazada.com/products/coffee-beans-i789012.html`

### Shopee

**SEO-friendly format:**
```
https://shopee.co.th/[Product-Name]-i.[shop_id].[item_id]
```

**Simple format:**
```
https://shopee.co.th/product/[shop_id]/[item_id]
```

**Examples:**
- `https://shopee.co.th/Matcha-Powder-Premium-i.123456.789012`
- `https://shopee.co.th/product/123456/789012`

## API Reference

### `IMarketplaceAdapter`

```typescript
interface IMarketplaceAdapter {
  fetchProduct(url: string): Promise<MarketplaceProduct>;
  searchProducts(keyword: string): Promise<MarketplaceProduct[]>;
}
```

### `MarketplaceProduct`

```typescript
interface MarketplaceProduct {
  title: string;          // Product name
  imageUrl: string;       // Product image URL
  storeName: string;      // Store/seller name
  price: number;         // Price in THB
  marketplace: 'lazada' | 'shopee';
  url: string;           // Original marketplace URL
}
```

### `MarketplaceError`

```typescript
class MarketplaceError extends Error {
  marketplace: string;
  originalError?: Error;
}
```

## Mock Data

The adapters currently use mock data for development and testing. The mock products include:

**Food & Beverage:**
- Matcha Powder Premium Grade (250-350฿)
- Coffee Beans Arabica Premium (400-500฿)
- Organic Honey (300-400฿)

**Electronics:**
- iPhone 15 Pro Max (35,000-43,000฿)
- Samsung Galaxy S24 Ultra (38,000-42,000฿)
- AirPods Pro (8,500-9,500฿)
- Sony WH-1000XM5 Headphones (13,000-15,000฿)

**Fashion:**
- Nike Air Max 270 (3,800-4,600฿)
- Adidas Ultraboost (5,000-6,000฿)
- Lululemon Align Pants (3,000-3,500฿)

**Beauty:**
- SK-II Facial Treatment Essence (6,800-7,600฿)
- Cetaphil Gentle Cleanser (400-500฿)

**Pricing Strategy:**
- Random price variance of ±5-20% from base price
- Allows testing both marketplaces as "Best Price"

## Testing

Run tests:

```bash
bun test
```

Run tests with coverage:

```bash
bun test --coverage
```

**Current Coverage:**
- Functions: 81.67%
- Lines: 86.58%

## Development

Type check:

```bash
bun run type-check
```

Watch mode for tests:

```bash
bun test --watch
```

## Future Enhancements

- [ ] Real API integration with Lazada Affiliate API
- [ ] Real API integration with Shopee Open Platform
- [ ] Rate limiting for API calls
- [ ] Response caching with Redis
- [ ] Retry logic with exponential backoff
- [ ] Product data enrichment (reviews, ratings, availability)

## Architecture Notes

### Marketplace Enum Mapping

The adapters return lowercase marketplace values (`'lazada' | 'shopee'`) to remain agnostic of the database schema. The service layer in `apps/api` should convert these to uppercase when saving to the database:

```typescript
// In service layer
await prisma.offer.create({
  data: {
    marketplace: product.marketplace.toUpperCase() as Marketplace,
    // ...
  }
});
```

This keeps the adapters decoupled from Prisma and allows them to be used in different contexts.

## License

Private - Affiliate Platform Project
