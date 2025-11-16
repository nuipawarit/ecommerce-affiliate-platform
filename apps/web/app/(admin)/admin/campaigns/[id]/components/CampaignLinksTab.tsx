"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { LinkCard } from "../../components/LinkCard";
import { LinkGenerationDialog } from "../../../links/components/LinkGenerationDialog";
import type { CampaignWithRelations, LinkWithRelations } from "@repo/shared";
import { CampaignStatus } from "@repo/shared";

interface CampaignLinksTabProps {
  campaign: CampaignWithRelations;
}

export function CampaignLinksTab({ campaign }: CampaignLinksTabProps) {
  const router = useRouter();
  const [showLinkDialog, setShowLinkDialog] = useState(false);

  const links = campaign.links || [];
  const products = campaign.campaignProducts?.map((cp) => cp.product) || [];

  const handleLinkGenerated = (link: LinkWithRelations) => {
    router.refresh();
  };

  const canGenerateLinks = products.length > 0 && campaign.status !== CampaignStatus.ENDED;

  return (
    <>
      <div className="space-y-4">
        {links.length > 0 && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {links.length} link{links.length === 1 ? "" : "s"} generated
            </p>
            {canGenerateLinks && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLinkDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate Link
              </Button>
            )}
          </div>
        )}

        {links.length > 0 ? (
          <div className="grid gap-4">
            {links.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No links generated</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                {products.length === 0
                  ? "Add products to this campaign before generating links"
                  : "Generate affiliate links for products in this campaign"}
              </p>
              {canGenerateLinks ? (
                <Button variant="outline" onClick={() => setShowLinkDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Link
                </Button>
              ) : campaign.status === 'ENDED' ? (
                <p className="text-sm text-muted-foreground">
                  Cannot generate links for ended campaigns
                </p>
              ) : (
                <Link href={`/admin/campaigns/${campaign.id}?tab=products`}>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Products
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <LinkGenerationDialog
        open={showLinkDialog}
        onOpenChange={setShowLinkDialog}
        campaignId={campaign.id}
        campaignName={campaign.name}
        products={products}
        onLinkGenerated={handleLinkGenerated}
      />
    </>
  );
}
