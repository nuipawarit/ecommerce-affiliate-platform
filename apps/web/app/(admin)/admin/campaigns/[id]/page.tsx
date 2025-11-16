import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Calendar, Tag, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiGet } from "@/lib/api-client";
import { CampaignForm } from "../components/CampaignForm";
import { CampaignStats } from "../components/CampaignStats";
import { StatusBadge } from "../components/StatusBadge";
import { CampaignProductsManager } from "../components/CampaignProductsManager";
import { CampaignLinksTab } from "./components/CampaignLinksTab";
import type { CampaignWithRelations, CampaignDetailResponse } from "@repo/shared";

async function getCampaign(
  params: Promise<{ id: string }>
): Promise<CampaignWithRelations | null> {
  const { id } = await params;

  try {
    const data = await apiGet<CampaignDetailResponse>(`/api/campaigns/${id}`);
    return data.campaign;
  } catch (error) {
    console.error("Failed to fetch campaign:", error);
    return null;
  }
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const campaign = await getCampaign(params);

  if (!campaign) {
    notFound();
  }

  const productIds =
    campaign.campaignProducts?.map((cp) => cp.product.id) || [];
  const products = campaign.campaignProducts?.map((cp) => cp.product) || [];
  const totalClicks =
    campaign.links?.reduce(
      (sum, link) => sum + (link._count?.clicks || 0),
      0
    ) || 0;
  const totalLinks = campaign._count?.links || 0;
  const totalProducts = campaign._count?.campaignProducts || 0;

  const formData = {
    id: campaign.id,
    name: campaign.name,
    slug: campaign.slug,
    description: campaign.description,
    status: campaign.status,
    startAt: campaign.startAt,
    endAt: campaign.endAt,
    utmCampaign: campaign.utmCampaign,
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "No date";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/campaigns"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold tracking-tight">
                {campaign.name}
              </h1>
              <StatusBadge status={campaign.status} />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              {(campaign.startAt || campaign.endAt) && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formatDate(campaign.startAt)} - {formatDate(campaign.endAt)}
                  </span>
                </div>
              )}

              <Separator orientation="vertical" className="h-4" />

              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <Badge variant="outline" className="font-mono text-xs">
                  {campaign.utmCampaign}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/campaign/${campaign.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Public Page
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <CampaignStats
        totalClicks={totalClicks}
        totalLinks={totalLinks}
        totalProducts={totalProducts}
      />

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <CampaignProductsManager
            campaignId={campaign.id}
            initialProducts={products}
            currentProductIds={productIds}
          />
        </TabsContent>

        <TabsContent value="links" className="space-y-4">
          <CampaignLinksTab campaign={campaign} />
        </TabsContent>

        <TabsContent value="settings">
          <CampaignForm mode="edit" initialData={formData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
