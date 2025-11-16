import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, MousePointerClick, Trophy } from "lucide-react";
import { apiGet } from "@/lib/api-client";
import { CampaignsTable } from "./components/CampaignsTable";
import type {
  CampaignWithRelations,
  CampaignsListResponse,
} from "@repo/shared";

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

  const totalClicks = campaigns.reduce(
    (sum, c) => sum + (c._count?.clicks ?? 0),
    0
  );
  const avgClicksPerCampaign =
    totalCampaigns > 0 ? Math.round(totalClicks / totalCampaigns) : 0;

  const topPerformingCampaign =
    campaigns.length > 0
      ? campaigns.reduce((top, campaign) => {
          const clicks = campaign._count?.clicks ?? 0;
          const topClicks = top?._count?.clicks ?? 0;
          return clicks > topClicks ? campaign : top;
        }, campaigns[0])
      : null;
  const topPerformerClicks = topPerformingCampaign?._count?.clicks ?? 0;

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Campaigns
                </p>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold mb-2">{stats.total}</p>
              <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                <span>{stats.active} Active</span>
                <span>{stats.draft} Draft</span>
                <span>{stats.paused} Paused/Ended</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Clicks
                </p>
                <MousePointerClick className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold text-blue-600">
                {totalClicks.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {avgClicksPerCampaign.toLocaleString()} avg per campaign
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Top Performer
                </p>
                <Trophy className="w-4 h-4 text-amber-600" />
              </div>
              {topPerformingCampaign ? (
                <>
                  <p className="text-xl font-bold text-amber-600 truncate">
                    {topPerformingCampaign.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {topPerformerClicks.toLocaleString()} clicks
                  </p>
                </>
              ) : (
                <p className="text-xl font-medium text-muted-foreground">
                  No clicks yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <CampaignsTable campaigns={campaigns} />
    </div>
  );
}
