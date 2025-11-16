import type { Metadata } from "next";
import { Navbar } from "@/components/public/Navbar";
import { HeroSection } from "@/components/public/HeroSection";
import { TrustBadges } from "@/components/public/TrustBadges";
import { StatsSection } from "@/components/public/StatsSection";
import { FeaturedCampaignSection } from "@/components/public/FeaturedCampaignSection";
import { CampaignSection } from "@/components/public/CampaignSection";
import { EmptyState } from "@/components/public/EmptyState";
import { Footer } from "@/components/public/Footer";
import { apiGet } from "@/lib/api-client";

export const metadata: Metadata = {
  title: "DealFinder - Compare Lazada & Shopee Prices | Best Deals & Savings",
  description:
    "Find the best prices across Lazada and Shopee. Compare deals in real-time, track prices, and save money on your favorite products with our price comparison platform.",
  keywords: [
    "price comparison",
    "Lazada",
    "Shopee",
    "best deals",
    "online shopping",
    "save money",
    "affiliate",
  ],
  authors: [{ name: "DealFinder" }],
  openGraph: {
    title: "DealFinder - Compare Prices & Save Money",
    description:
      "Compare prices across Lazada and Shopee to find the best deals. Save money on every purchase.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DealFinder - Best Deals on Lazada & Shopee",
    description: "Compare prices and save money with real-time price tracking",
  },
};

interface Campaign {
  id: string;
  name: string;
  description?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  campaignProducts: Array<{
    product: {
      id: string;
      title: string;
      imageUrl: string;
      offers: Array<{
        id: string;
        marketplace: "LAZADA" | "SHOPEE";
        storeName: string;
        price: number;
      }>;
    };
  }>;
  links: Array<{
    id: string;
    shortCode: string;
    offerId: string;
  }>;
}

async function getActiveCampaigns() {
  try {
    const response = await apiGet<{ campaigns: Campaign[] }>(
      "/api/campaigns?status=ACTIVE&limit=12"
    );
    return response.campaigns || [];
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return [];
  }
}

export default async function HomePage() {
  const campaigns = await getActiveCampaigns();
  const hasCampaigns = campaigns.length > 0;
  const featuredCampaign = campaigns[0];
  const otherCampaigns = campaigns.slice(1);

  const totalProducts = campaigns.reduce(
    (sum, c) => sum + c.campaignProducts.length,
    0
  );
  const totalClicks = 10000;

  return (
    <>
      <Navbar />

      <main className="pt-16 md:pt-20">
        <HeroSection />

        <TrustBadges />

        <StatsSection
          totalProducts={totalProducts}
          activeCampaigns={campaigns.length}
          totalClicks={totalClicks}
        />

        {!hasCampaigns ? (
          <EmptyState />
        ) : (
          <>
            {featuredCampaign && (
              <FeaturedCampaignSection campaign={featuredCampaign} />
            )}

            {otherCampaigns.map((campaign) => (
              <CampaignSection key={campaign.id} campaign={campaign} />
            ))}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
