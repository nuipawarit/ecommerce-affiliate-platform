"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "./StatusBadge";
import { apiDelete } from "@/lib/api-client";
import { Eye, Pencil, Trash2, Search, Megaphone, Calendar, Clock } from "lucide-react";
import type { CampaignWithRelations } from "@repo/shared";

interface CampaignsTableProps {
  campaigns: CampaignWithRelations[];
}

export function CampaignsTable({ campaigns }: CampaignsTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<CampaignWithRelations | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async () => {
    if (!campaignToDelete) return;

    setDeleting(true);
    try {
      await apiDelete(`/api/campaigns/${campaignToDelete.id}`);
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete campaign:", error);
      alert("Failed to delete campaign");
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteDialog = (e: React.MouseEvent, campaign: CampaignWithRelations) => {
    e.stopPropagation();
    setCampaignToDelete(campaign);
    setDeleteDialogOpen(true);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCampaignDuration = (campaign: CampaignWithRelations) => {
    if (!campaign.endAt) return null;

    const now = new Date();
    const endDate = new Date(campaign.endAt);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Ended";
    if (diffDays === 0) return "Ends today";
    if (diffDays === 1) return "1 day remaining";
    if (diffDays <= 7) return `${diffDays} days remaining`;
    return null;
  };

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Get started by creating your first marketing campaign to promote your products
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search campaigns by name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Try adjusting your search query
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Products</TableHead>
                    <TableHead className="text-center">Links</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => {
                    const duration = getCampaignDuration(campaign);

                    return (
                      <TableRow
                        key={campaign.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => router.push(`/admin/campaigns/${campaign.id}`)}
                      >
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{campaign.name}</span>
                            <span className="text-xs text-muted-foreground">{campaign.slug}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={campaign.status} />
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-medium">
                              {campaign._count?.campaignProducts ?? 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-medium">
                              {campaign._count?.links ?? 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                            {formatDate(campaign.startAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-sm">
                              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                              {formatDate(campaign.endAt)}
                            </div>
                            {duration && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span className={
                                  duration === "Ended" ? "text-gray-500" :
                                  duration.includes("day") && parseInt(duration) <= 3 ? "text-orange-600 font-medium" :
                                  "text-muted-foreground"
                                }>
                                  {duration}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/campaigns/${campaign.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label="View campaign"
                                onClick={(e) => e.stopPropagation()}
                                className="hover:bg-accent transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/campaigns/${campaign.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label="Edit campaign"
                                onClick={(e) => e.stopPropagation()}
                                className="hover:bg-accent transition-colors"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => openDeleteDialog(e, campaign)}
                              aria-label="Delete campaign"
                              className="hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{campaignToDelete?.name}
              &quot;? This will archive the campaign and it can be restored
              later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
