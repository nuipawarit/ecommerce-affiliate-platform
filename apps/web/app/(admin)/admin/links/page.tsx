import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Link as LinkIcon,
  MousePointerClick,
  Trophy,
} from "lucide-react";
import { apiGet } from "@/lib/api-client";
import { LinksTable } from "./components/LinksTable";
import type { LinkWithRelations } from "@repo/shared";

async function getLinks(): Promise<LinkWithRelations[]> {
  try {
    const links = await apiGet<LinkWithRelations[]>("/api/links");
    return links;
  } catch (error) {
    console.error("Failed to fetch links:", error);
    return [];
  }
}

export default async function LinksPage() {
  const links = await getLinks();

  const totalLinks = links.length;
  const totalClicks = links.reduce(
    (sum, link) => sum + (link._count?.clicks ?? 0),
    0
  );

  const avgClicksPerLink =
    totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : "0";

  const topPerformingLink = links.length > 0
    ? links.reduce((top, link) => {
        const clicks = link._count?.clicks ?? 0;
        const topClicks = top._count?.clicks ?? 0;
        return clicks > topClicks ? link : top;
      }, links[0])
    : null;

  const topPerformerClicks = topPerformingLink?._count?.clicks ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Affiliate Links</h1>
          <p className="text-muted-foreground">
            Generate and track affiliate short links
          </p>
        </div>
        <Link href="/admin/links/new">
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Generate Link
          </Button>
        </Link>
      </div>

      {totalLinks > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Links
                </p>
                <LinkIcon className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{totalLinks}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Generated affiliate links
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Clicks
                </p>
                <MousePointerClick className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">
                {totalClicks.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {avgClicksPerLink} avg per link
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
              {topPerformingLink ? (
                <>
                  <p className="text-xl font-bold text-amber-600 truncate">
                    {topPerformingLink.product?.title || "Unknown Product"}
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

      <LinksTable links={links} />
    </div>
  );
}
