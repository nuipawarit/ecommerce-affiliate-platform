import type { MarketplaceProduct } from "./types";

export function isValidLazadaUrl(url: string): boolean {
  const lazadaPattern = /lazada\..*?\/.*?-i(\d+)/;
  return lazadaPattern.test(url);
}

export function isValidShopeeUrl(url: string): boolean {
  const shopeePatterns = [
    /shopee\.co\.th\/.*?\.(\d+)\.(\d+)/,
    /shopee\.co\.th\/product\/(\d+)\/(\d+)/,
  ];
  return shopeePatterns.some((pattern) => pattern.test(url));
}

export function extractLazadaProductId(url: string): string {
  const match = url.match(/lazada\..*?\/.*?-i(\d+)/);
  if (!match || !match[1]) {
    throw new Error(`Cannot extract product ID from Lazada URL: ${url}`);
  }
  return match[1];
}

export function extractShopeeProductId(url: string): {
  shopId: string;
  itemId: string;
} {
  const seoMatch = url.match(/shopee\.co\.th\/.*?\.(\d+)\.(\d+)/);
  if (seoMatch && seoMatch[1] && seoMatch[2]) {
    return { shopId: seoMatch[1], itemId: seoMatch[2] };
  }

  const simpleMatch = url.match(/shopee\.co\.th\/product\/(\d+)\/(\d+)/);
  if (simpleMatch && simpleMatch[1] && simpleMatch[2]) {
    return { shopId: simpleMatch[1], itemId: simpleMatch[2] };
  }

  throw new Error(`Cannot extract product ID from Shopee URL: ${url}`);
}

interface MockProduct {
  title: string;
  imageUrl: string;
  storeName: string;
  basePrice: number;
  category: string;
  keywords: string[];
  sku: string;
}

const MOCK_PRODUCTS: MockProduct[] = [
  {
    title: "Matcha Powder Premium Grade - Japanese Green Tea 100g",
    imageUrl: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=800",
    storeName: "Organic Tea Shop",
    basePrice: 299,
    category: "food",
    keywords: ["matcha", "tea", "green", "organic", "japanese"],
    sku: "MT-JP-100",
  },
  {
    title: "Coffee Beans Arabica Premium 1kg - Thai Highland",
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800",
    storeName: "Coffee House Thailand",
    basePrice: 450,
    category: "food",
    keywords: ["coffee", "beans", "arabica", "thai"],
    sku: "CF-AR-1K",
  },
  {
    title: "Organic Honey 500ml - Pure Raw Wildflower",
    imageUrl:
      "https://images.unsplash.com/photo-1616987381923-7b5118f26a6d?w=800",
    storeName: "Nature Shop",
    basePrice: 350,
    category: "food",
    keywords: ["honey", "organic", "raw", "natural"],
    sku: "HN-WF-500",
  },
  {
    title: "iPhone 15 Pro Max 256GB - Titanium Blue",
    imageUrl:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
    storeName: "iStudio Thailand",
    basePrice: 42990,
    category: "electronics",
    keywords: ["iphone", "apple", "phone", "smartphone", "15", "pro"],
    sku: "IP15PM-256-TB",
  },
  {
    title: "Samsung Galaxy S24 Ultra 512GB - Titanium Gray",
    imageUrl:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
    storeName: "Samsung Official Store",
    basePrice: 39990,
    category: "electronics",
    keywords: ["samsung", "galaxy", "s24", "android", "phone", "smartphone"],
    sku: "SGS24U-512-TG",
  },
  {
    title: "AirPods Pro (2nd Generation) with MagSafe Charging",
    imageUrl:
      "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800",
    storeName: "Apple Authorized Reseller",
    basePrice: 8990,
    category: "electronics",
    keywords: ["airpods", "apple", "earbuds", "wireless", "pro"],
    sku: "APP2-MSG",
  },
  {
    title: "Nike Air Max 270 React - White/Black US 9",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    storeName: "Nike Official Store",
    basePrice: 4200,
    category: "fashion",
    keywords: ["nike", "shoes", "sneakers", "air max", "running"],
    sku: "NK-AM270-WB-9",
  },
  {
    title: "Adidas Ultraboost 22 - Core Black US 10",
    imageUrl:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
    storeName: "Adidas Thailand",
    basePrice: 5500,
    category: "fashion",
    keywords: ["adidas", "shoes", "ultraboost", "running", "sneakers"],
    sku: "AD-UB22-CB-10",
  },
  {
    title: "SK-II Facial Treatment Essence 230ml",
    imageUrl:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
    storeName: "Beauty Siam",
    basePrice: 7200,
    category: "beauty",
    keywords: ["sk-ii", "skincare", "essence", "beauty", "facial"],
    sku: "SKII-FTE-230",
  },
  {
    title: "Cetaphil Gentle Skin Cleanser 500ml",
    imageUrl: "https://images.unsplash.com/photo-1556228852-80a5e2f40c9d?w=800",
    storeName: "Watson Thailand",
    basePrice: 450,
    category: "beauty",
    keywords: ["cetaphil", "cleanser", "skincare", "gentle", "face wash"],
    sku: "CTP-GSC-500",
  },
  {
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    imageUrl: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800",
    storeName: "Sony Store Thailand",
    basePrice: 13990,
    category: "electronics",
    keywords: ["sony", "headphones", "wireless", "noise cancelling", "audio"],
    sku: "SN-WH1000XM5",
  },
  {
    title: 'Lululemon Align High-Rise Pant 28" - Black Size 6',
    imageUrl:
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800",
    storeName: "Lululemon Thailand",
    basePrice: 3200,
    category: "fashion",
    keywords: ["lululemon", "yoga", "pants", "leggings", "activewear"],
    sku: "LL-AHR28-BK-6",
  },
];

export function generateMockProduct(
  marketplace: "lazada" | "shopee",
  productId: string,
  url: string
): MarketplaceProduct {
  const index = parseInt(productId.slice(-2)) % MOCK_PRODUCTS.length;
  const mockProduct = MOCK_PRODUCTS[index] ?? MOCK_PRODUCTS[0];
  if (!mockProduct) {
    throw new Error("No mock products available");
  }

  const priceVariance = 0.05 + Math.random() * 0.15;
  const price = Math.round(
    mockProduct.basePrice *
      (1 + (Math.random() > 0.5 ? priceVariance : -priceVariance))
  );

  return {
    title: mockProduct.title,
    imageUrl: mockProduct.imageUrl,
    storeName: mockProduct.storeName,
    price,
    marketplace,
    url,
    sku: mockProduct.sku,
  };
}

export function searchMockProducts(
  marketplace: "lazada" | "shopee",
  keyword: string
): MarketplaceProduct[] {
  const normalizedKeyword = keyword.toLowerCase().trim();

  if (!normalizedKeyword) {
    return [];
  }

  const matchingProducts = MOCK_PRODUCTS.filter(
    (product) =>
      product.sku.toLowerCase().includes(normalizedKeyword) ||
      product.keywords.some((kw) => kw.includes(normalizedKeyword)) ||
      product.title.toLowerCase().includes(normalizedKeyword) ||
      product.category.toLowerCase().includes(normalizedKeyword)
  ).slice(0, 5);

  return matchingProducts.map((product, index) => {
    const priceVariance = 0.05 + Math.random() * 0.15;
    const price = Math.round(
      product.basePrice *
        (1 + (Math.random() > 0.5 ? priceVariance : -priceVariance))
    );

    const urlBase =
      marketplace === "lazada"
        ? `https://www.lazada.co.th/products/${product.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-i${100000 + index}`
        : `https://shopee.co.th/${product.title.replace(/[^a-zA-Z0-9]+/g, "-")}-i.${50000 + index}.${200000 + index}`;

    return {
      title: product.title,
      imageUrl: product.imageUrl,
      storeName: product.storeName,
      price,
      marketplace,
      url: urlBase,
      sku: product.sku,
    };
  });
}
