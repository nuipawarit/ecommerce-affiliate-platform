import { prisma } from './src/client';

console.log('🔍 Testing database connection and queries...\n');

console.log('1️⃣  Testing Product queries:');
const products = await prisma.product.findMany({
  include: {
    offers: true,
    _count: {
      select: { links: true, campaignProducts: true }
    }
  }
});
console.log(`   ✅ Found ${products.length} products`);
products.forEach(p => {
  console.log(`      - ${p.title}: ${p.offers.length} offers, ${p._count.links} links`);
});

console.log('\n2️⃣  Testing Campaign queries:');
const campaigns = await prisma.campaign.findMany({
  include: {
    _count: {
      select: { links: true, campaignProducts: true }
    }
  }
});
console.log(`   ✅ Found ${campaigns.length} campaigns`);
campaigns.forEach(c => {
  console.log(`      - ${c.name} (${c.slug}): ${c._count.campaignProducts} products, ${c._count.links} links`);
});

console.log('\n3️⃣  Testing Marketplace-specific queries:');
const lazadaOffers = await prisma.offer.findMany({
  where: { marketplace: 'LAZADA' },
  include: { product: { select: { title: true } } }
});
const shopeeOffers = await prisma.offer.findMany({
  where: { marketplace: 'SHOPEE' },
  include: { product: { select: { title: true } } }
});
console.log(`   ✅ Lazada offers: ${lazadaOffers.length}`);
console.log(`   ✅ Shopee offers: ${shopeeOffers.length}`);

console.log('\n4️⃣  Testing Best Price query:');
const productWithOffers = await prisma.product.findFirst({
  include: {
    offers: {
      orderBy: { price: 'asc' },
      take: 1
    }
  }
});
if (productWithOffers && productWithOffers.offers[0]) {
  const bestOffer = productWithOffers.offers[0];
  console.log(`   ✅ Best price for "${productWithOffers.title}": ฿${bestOffer.price} at ${bestOffer.marketplace}`);
}

console.log('\n5️⃣  Testing Link with full relations:');
const link = await prisma.link.findFirst({
  include: {
    product: { select: { title: true } },
    campaign: { select: { name: true } },
    offer: { select: { marketplace: true, price: true } },
    _count: { select: { clicks: true } }
  }
});
if (link) {
  console.log(`   ✅ Link ${link.shortCode}:`);
  console.log(`      Product: ${link.product.title}`);
  console.log(`      Campaign: ${link.campaign.name}`);
  console.log(`      Marketplace: ${link.offer.marketplace} (฿${link.offer.price})`);
  console.log(`      Clicks: ${link._count.clicks}`);
}

console.log('\n6️⃣  Testing Analytics query (clicks by campaign):');
const clickStats = await prisma.click.groupBy({
  by: ['linkId'],
  _count: { id: true }
});
console.log(`   ✅ ${clickStats.length} links have clicks`);

console.log('\n7️⃣  Testing Campaign-Product junction:');
const campaignWithProducts = await prisma.campaign.findFirst({
  include: {
    campaignProducts: {
      include: {
        product: {
          select: { title: true }
        }
      },
      orderBy: { position: 'asc' }
    }
  }
});
if (campaignWithProducts) {
  console.log(`   ✅ Campaign "${campaignWithProducts.name}" has products:`);
  campaignWithProducts.campaignProducts.forEach((cp, idx) => {
    console.log(`      ${idx + 1}. ${cp.product.title} (position: ${cp.position})`);
  });
}

console.log('\n✅ All database tests passed successfully! 🎉\n');

await prisma.$disconnect();
