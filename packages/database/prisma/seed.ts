import { PrismaClient, Marketplace, CampaignStatus } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  console.log('📦 Creating products with offers...');

  const product1 = await prisma.product.create({
    data: {
      title: 'Matcha Powder Premium Grade - Japanese Green Tea',
      description: 'High-quality ceremonial grade matcha powder imported from Japan. Perfect for lattes, smoothies, and traditional tea ceremonies.',
      imageUrl: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=800',
      offers: {
        create: [
          {
            marketplace: Marketplace.LAZADA,
            storeName: 'Lazada Official Store',
            price: 299.00,
            url: 'https://www.lazada.co.th/products/matcha-powder-i123456.html',
            isActive: true
          },
          {
            marketplace: Marketplace.SHOPEE,
            storeName: 'Shopee Mall',
            price: 279.00,
            url: 'https://shopee.co.th/Matcha-Powder-Premium-i.123.456789',
            isActive: true
          }
        ]
      }
    },
    include: { offers: true }
  });

  const product2 = await prisma.product.create({
    data: {
      title: 'Coffee Beans Arabica Premium 1kg',
      description: 'Freshly roasted Arabica coffee beans from Thailand highlands. Rich aroma with notes of chocolate and caramel.',
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800',
      offers: {
        create: [
          {
            marketplace: Marketplace.LAZADA,
            storeName: 'Coffee House Thailand',
            price: 450.00,
            url: 'https://www.lazada.co.th/products/arabica-coffee-i789012.html',
            isActive: true
          },
          {
            marketplace: Marketplace.SHOPEE,
            storeName: 'Cafe Official',
            price: 420.00,
            url: 'https://shopee.co.th/Arabica-Coffee-Beans-i.789.012345',
            isActive: true
          }
        ]
      }
    },
    include: { offers: true }
  });

  const product3 = await prisma.product.create({
    data: {
      title: 'Organic Honey 500ml - Pure Raw Honey',
      description: '100% pure raw organic honey harvested from wildflower meadows. No additives, no preservatives.',
      imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784568?w=800',
      offers: {
        create: [
          {
            marketplace: Marketplace.LAZADA,
            storeName: 'Nature Shop',
            price: 350.00,
            url: 'https://www.lazada.co.th/products/organic-honey-i345678.html',
            isActive: true
          },
          {
            marketplace: Marketplace.SHOPEE,
            storeName: 'Organic Market',
            price: 380.00,
            url: 'https://shopee.co.th/Organic-Honey-Raw-i.345.678901',
            isActive: true
          }
        ]
      }
    },
    include: { offers: true }
  });

  console.log(`✅ Created 3 products with offers`);

  console.log('📋 Creating campaigns...');

  const campaign1 = await prisma.campaign.create({
    data: {
      name: 'Summer Health & Wellness Sale 2025',
      slug: 'summer-wellness-2025',
      description: 'Get the best deals on organic and healthy products this summer!',
      status: CampaignStatus.ACTIVE,
      utmCampaign: 'summer_wellness_2025',
      utmSource: 'affiliate',
      utmMedium: 'landing_page',
      startAt: new Date('2025-06-01'),
      endAt: new Date('2025-08-31')
    }
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      name: 'Coffee Lovers Special',
      slug: 'coffee-lovers-special',
      description: 'Premium coffee products at unbeatable prices!',
      status: CampaignStatus.ACTIVE,
      utmCampaign: 'coffee_special',
      utmSource: 'affiliate',
      utmMedium: 'social',
      startAt: new Date('2025-01-01'),
      endAt: new Date('2025-12-31')
    }
  });

  console.log(`✅ Created 2 campaigns`);

  console.log('🔗 Linking products to campaigns...');

  await prisma.campaignProduct.createMany({
    data: [
      { campaignId: campaign1.id, productId: product1.id, position: 1 },
      { campaignId: campaign1.id, productId: product3.id, position: 2 },
      { campaignId: campaign2.id, productId: product2.id, position: 1 },
    ]
  });

  console.log(`✅ Linked products to campaigns`);

  console.log('🔗 Creating affiliate links...');

  const links = [];

  for (const product of [product1, product2, product3]) {
    for (const offer of product.offers) {
      const campaign = product.id === product2.id ? campaign2 : campaign1;

      const utmParams = new URLSearchParams({
        utm_campaign: campaign.utmCampaign,
        utm_source: campaign.utmSource || 'affiliate',
        utm_medium: campaign.utmMedium || 'web'
      });

      const targetUrl = `${offer.url}?${utmParams.toString()}`;

      const link = await prisma.link.create({
        data: {
          productId: product.id,
          campaignId: campaign.id,
          offerId: offer.id,
          shortCode: nanoid(8),
          targetUrl
        }
      });

      links.push(link);
    }
  }

  console.log(`✅ Created ${links.length} affiliate links`);

  console.log('📊 Creating sample click data...');

  const clicksData = [];
  const now = new Date();

  for (const link of links.slice(0, 3)) {
    for (let i = 0; i < 5; i++) {
      const timestamp = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      clicksData.push({
        linkId: link.id,
        timestamp,
        referrer: i % 2 === 0 ? 'https://facebook.com' : 'https://google.com',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        country: 'TH'
      });
    }
  }

  await prisma.click.createMany({
    data: clicksData
  });

  console.log(`✅ Created ${clicksData.length} sample clicks`);

  console.log('\n🎉 Database seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - 3 Products`);
  console.log(`   - 6 Offers (3 from Lazada, 3 from Shopee)`);
  console.log(`   - 2 Campaigns`);
  console.log(`   - ${links.length} Affiliate Links`);
  console.log(`   - ${clicksData.length} Sample Clicks`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
