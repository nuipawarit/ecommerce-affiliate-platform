import {
  PrismaClient,
  Marketplace,
  CampaignStatus,
  type Product,
  type Offer,
} from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

type ProductWithOffers = Product & { offers: Offer[] };

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
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800",
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

async function main() {
  console.log("🌱 Starting database seed...");

  console.log("📦 Creating products with offers...");

  const products: ProductWithOffers[] = [];

  for (const mockProduct of MOCK_PRODUCTS) {
    const priceVarianceLazada = 0.05 + Math.random() * 0.15;
    const priceVarianceShopee = 0.05 + Math.random() * 0.15;
    const lazadaPrice = Math.round(
      mockProduct.basePrice *
        (1 + (Math.random() > 0.5 ? priceVarianceLazada : -priceVarianceLazada))
    );
    const shopeePrice = Math.round(
      mockProduct.basePrice *
        (1 + (Math.random() > 0.5 ? priceVarianceShopee : -priceVarianceShopee))
    );

    const product = await prisma.product.create({
      data: {
        title: mockProduct.title,
        description: `${mockProduct.title} - High quality product from ${mockProduct.storeName}. Category: ${mockProduct.category}.`,
        imageUrl: mockProduct.imageUrl,
        offers: {
          create: [
            {
              marketplace: Marketplace.LAZADA,
              storeName: `${mockProduct.storeName} - Lazada`,
              price: lazadaPrice,
              url: `https://www.lazada.co.th/products/${mockProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-i${100000 + products.length}`,
              sku: mockProduct.sku,
              isActive: true,
            },
            {
              marketplace: Marketplace.SHOPEE,
              storeName: `${mockProduct.storeName} - Shopee`,
              price: shopeePrice,
              url: `https://shopee.co.th/${mockProduct.title.replace(/[^a-zA-Z0-9]+/g, "-")}-i.${50000 + products.length}.${200000 + products.length}`,
              sku: mockProduct.sku,
              isActive: true,
            },
          ],
        },
      },
      include: { offers: true },
    });

    products.push(product);
  }

  console.log(
    `✅ Created ${products.length} products with ${products.length * 2} offers`
  );

  console.log("📋 Creating campaigns...");

  const campaign1 = await prisma.campaign.create({
    data: {
      name: "Health & Wellness Sale 2025",
      slug: "health-wellness-2025",
      description: "Get the best deals on food, beauty, and wellness products!",
      status: CampaignStatus.ACTIVE,
      utmCampaign: "health_wellness_2025",
      startAt: new Date("2025-01-01"),
      endAt: new Date("2025-12-31"),
    },
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      name: "Tech & Electronics Deals",
      slug: "tech-electronics-deals",
      description: "Premium electronics and gadgets at unbeatable prices!",
      status: CampaignStatus.ACTIVE,
      utmCampaign: "tech_deals",
      startAt: new Date("2025-01-01"),
      endAt: new Date("2025-12-31"),
    },
  });

  const campaign3 = await prisma.campaign.create({
    data: {
      name: "Fashion & Lifestyle Collection",
      slug: "fashion-lifestyle",
      description: "Discover the latest trends in fashion and activewear!",
      status: CampaignStatus.ACTIVE,
      utmCampaign: "fashion_collection",
      startAt: new Date("2025-01-01"),
      endAt: new Date("2025-12-31"),
    },
  });

  console.log(`✅ Created 3 campaigns`);

  console.log("🔗 Linking products to campaigns...");

  const campaignProducts = [];
  let position = 1;

  for (const product of products) {
    const mockProduct = MOCK_PRODUCTS.find(
      (mp) => mp.sku === product.offers[0]?.sku
    );
    if (!mockProduct) continue;

    let campaignId: string;
    if (mockProduct.category === "food" || mockProduct.category === "beauty") {
      campaignId = campaign1.id;
    } else if (mockProduct.category === "electronics") {
      campaignId = campaign2.id;
    } else {
      campaignId = campaign3.id;
    }

    campaignProducts.push({
      campaignId,
      productId: product.id,
      position: position++,
    });
  }

  await prisma.campaignProduct.createMany({
    data: campaignProducts,
  });

  console.log(`✅ Linked ${campaignProducts.length} products to campaigns`);

  console.log("🔗 Creating affiliate links...");

  const links = [];

  for (const product of products) {
    const mockProduct = MOCK_PRODUCTS.find(
      (mp) => mp.sku === product.offers[0]?.sku
    );
    if (!mockProduct) continue;

    let campaign;
    if (mockProduct.category === "food" || mockProduct.category === "beauty") {
      campaign = campaign1;
    } else if (mockProduct.category === "electronics") {
      campaign = campaign2;
    } else {
      campaign = campaign3;
    }

    for (const offer of product.offers) {
      const utmParams = new URLSearchParams({
        utm_campaign: campaign.utmCampaign,
      });

      const targetUrl = `${offer.url}?${utmParams.toString()}`;

      const link = await prisma.link.create({
        data: {
          productId: product.id,
          campaignId: campaign.id,
          offerId: offer.id,
          shortCode: nanoid(8),
          targetUrl,
        },
      });

      links.push(link);
    }
  }

  console.log(`✅ Created ${links.length} affiliate links`);

  console.log("📊 Creating sample click data...");

  const clicksData = [];
  const now = new Date();

  for (const link of links.slice(0, 3)) {
    for (let i = 0; i < 5; i++) {
      const timestamp = new Date(
        now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000
      );
      clicksData.push({
        linkId: link.id,
        timestamp,
        referrer: i % 2 === 0 ? "https://facebook.com" : "https://google.com",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        country: "TH",
      });
    }
  }

  await prisma.click.createMany({
    data: clicksData,
  });

  console.log(`✅ Created ${clicksData.length} sample clicks`);

  console.log("\n🎉 Database seed completed successfully!\n");
  console.log("📊 Summary:");
  console.log(`   - ${products.length} Products`);
  console.log(
    `   - ${products.length * 2} Offers (${products.length} from Lazada, ${products.length} from Shopee)`
  );
  console.log(`   - 3 Campaigns`);
  console.log(`   - ${links.length} Affiliate Links`);
  console.log(`   - ${clicksData.length} Sample Clicks`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
