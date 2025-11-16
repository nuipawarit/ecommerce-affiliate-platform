import { prisma } from "@repo/database";
import type { Product, Campaign, Link, Offer } from "@repo/database";

export async function cleanupDatabase() {
  await prisma.click.deleteMany();
  await prisma.link.deleteMany();
  await prisma.campaignProduct.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.product.deleteMany();
}

export async function createTestProduct(
  data?: Partial<Product>
): Promise<Product> {
  return prisma.product.create({
    data: {
      title: data?.title || "Test Product",
      imageUrl:
        data?.imageUrl || "https://images.unsplash.com/photo-test.jpg",
      ...data,
    },
  });
}

export async function createTestOffer(
  productId: string,
  data?: Partial<Offer>
): Promise<Offer> {
  return prisma.offer.create({
    data: {
      productId,
      marketplace: data?.marketplace || "LAZADA",
      storeName: data?.storeName || "Test Store",
      price: data?.price || 100,
      url: data?.url || "https://lazada.co.th/test-i123456",
      sku: data?.sku || "TEST-SKU-001",
      ...data,
    },
  });
}

export async function createTestCampaign(
  data?: Partial<Campaign>
): Promise<Campaign> {
  const name = data?.name || "Test Campaign";
  const slug = data?.slug || `test-campaign-${Date.now()}`;

  return prisma.campaign.create({
    data: {
      name,
      slug,
      utmCampaign: data?.utmCampaign || slug,
      status: data?.status || "ACTIVE",
      ...data,
    },
  });
}

export async function createTestLink(
  productId: string,
  campaignId: string,
  offerId: string,
  data?: Partial<Link>
): Promise<Link> {
  const shortCode =
    data?.shortCode ||
    `test${Math.random().toString(36).substring(2, 10)}`;

  return prisma.link.create({
    data: {
      productId,
      campaignId,
      offerId,
      shortCode,
      targetUrl: data?.targetUrl || "https://lazada.co.th/test?utm_campaign=test",
      ...data,
    },
  });
}

export async function createTestProductWithOffers(): Promise<{
  product: Product;
  lazadaOffer: Offer;
  shopeeOffer: Offer;
}> {
  const product = await createTestProduct({
    title: "Test Product with Multiple Offers",
  });

  const lazadaOffer = await createTestOffer(product.id, {
    marketplace: "LAZADA",
    storeName: "Lazada Official",
    price: 299,
    url: "https://lazada.co.th/test-i123456",
  });

  const shopeeOffer = await createTestOffer(product.id, {
    marketplace: "SHOPEE",
    storeName: "Shopee Mall",
    price: 250,
    url: "https://shopee.co.th/test-i.123456.789012",
  });

  return { product, lazadaOffer, shopeeOffer };
}

export async function createTestCampaignWithProducts(
  productIds: string[]
): Promise<Campaign> {
  const campaign = await createTestCampaign();

  await Promise.all(
    productIds.map((productId, index) =>
      prisma.campaignProduct.create({
        data: {
          campaignId: campaign.id,
          productId,
          position: index,
        },
      })
    )
  );

  return campaign;
}
