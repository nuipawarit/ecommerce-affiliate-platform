import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, TrendingUp, Calendar, Pause, Package, Link as LinkIcon } from "lucide-react";
import { apiGet } from "@/lib/api-client";
import { CampaignsTable } from "./components/CampaignsTable";
import type { CampaignWithRelations, CampaignsListResponse } from "@repo/shared";

async function getCampaigns(): Promise<CampaignWithRelations[]> {
  try {
    const data = await apiGet<CampaignsListResponse>("/api/campaigns");
    return data.campaigns || [];
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return [];
  }
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  const totalCampaigns = campaigns.length;
  const stats = {
    total: totalCampaigns,
    active: campaigns.filter((c) => c.status === "ACTIVE").length,
    draft: campaigns.filter((c) => c.status === "DRAFT").length,
    paused: campaigns.filter(
      (c) => c.status === "PAUSED" || c.status === "ENDED"
    ).length,
  };

  const totalProducts = campaigns.reduce(
    (sum, c) => sum + (c._count?.campaignProducts ?? 0),
    0
  );
  const totalLinks = campaigns.reduce(
    (sum, c) => sum + (c._count?.links ?? 0),
    0
  );
  const avgProductsPerCampaign = totalCampaigns > 0
    ? Math.round(totalProducts / totalCampaigns)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage marketing campaigns
          </p>
        </div>
        <Link href="/admin/campaigns/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      {totalCampaigns > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Campaigns
                </p>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Across all statuses
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Active Campaigns
                </p>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Currently running
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Products
                </p>
                <Package className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{totalProducts}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {avgProductsPerCampaign} avg per campaign
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Links
                </p>
                <LinkIcon className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{totalLinks}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Affiliate tracking links
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <CampaignsTable campaigns={campaigns} />
    </div>
  );
}
