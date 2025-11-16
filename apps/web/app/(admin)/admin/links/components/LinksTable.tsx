"use client";

import { useState } from "react";
import Image from "next/image";
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
import { buildAffiliateLink } from "@/lib/link-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Copy,
  Check,
  ExternalLink,
  MoreVertical,
  BarChart3,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { LinkWithRelations } from "@repo/shared";

interface LinksTableProps {
  links: LinkWithRelations[];
}

export function LinksTable({ links }: LinksTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const maxClicks = Math.max(...links.map((l) => l._count?.clicks ?? 0), 0);
  const avgClicks =
    links.length > 0
      ? links.reduce((sum, l) => sum + (l._count?.clicks ?? 0), 0) /
        links.length
      : 0;

  const getPerformanceLevel = (clicks: number) => {
    if (maxClicks === 0) return "none";
    const percentage = (clicks / maxClicks) * 100;
    if (percentage >= 80) return "high";
    if (percentage >= 40) return "medium";
    if (clicks > 0) return "low";
    return "none";
  };

  const getClickColor = (clicks: number) => {
    const level = getPerformanceLevel(clicks);
    if (level === "high") return "text-green-600 dark:text-green-400";
    if (level === "medium") return "text-blue-600 dark:text-blue-400";
    if (level === "low") return "text-muted-foreground";
    return "text-muted-foreground";
  };

  const filteredLinks = links.filter((link) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      link.product?.title.toLowerCase().includes(searchLower) ||
      link.campaign?.name.toLowerCase().includes(searchLower) ||
      link.shortCode.toLowerCase().includes(searchLower)
    );
  });

  const handleCopy = async (
    e: React.MouseEvent,
    shortCode: string,
    linkId: string
  ) => {
    e.stopPropagation();
    const shortUrl = buildAffiliateLink(shortCode);
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(linkId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (links.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <ExternalLink className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No affiliate links yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            Create your first affiliate link to start tracking clicks and
            performance
          </p>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-semibold">1.</span>
              <span>Create a campaign with products</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-semibold">2.</span>
              <span>Generate affiliate link for each product</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-semibold">3.</span>
              <span>Share links and track performance here</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by product or campaign..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {filteredLinks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No links found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Try adjusting your search query
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="w-[180px]">Short Link</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Marketplace</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-center">Created</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLinks.map((link) => {
                  const clicks = link._count?.clicks ?? 0;
                  const performanceLevel = getPerformanceLevel(clicks);
                  const isTopPerformer = clicks === maxClicks && clicks > 0;

                  return (
                    <TableRow
                      key={link.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() =>
                        router.push(`/admin/campaigns/${link.campaign?.id}`)
                      }
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {link.product && (
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border shadow-sm">
                              <Image
                                src={link.product.imageUrl}
                                alt={link.product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex flex-col min-w-0 gap-1">
                            <span className="font-medium text-sm line-clamp-1">
                              {link.product?.title || "Unknown Product"}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {link.campaign?.name || "Unknown"}
                              </span>
                              {isTopPerformer && (
                                <Badge
                                  variant="secondary"
                                  className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0 h-4 dark:bg-amber-950 dark:text-amber-400"
                                >
                                  🔥 Top
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                            /go/{link.shortCode}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) =>
                              handleCopy(e, link.shortCode, link.id)
                            }
                            className="h-6 w-6 p-0 shrink-0"
                            aria-label="Copy short link"
                          >
                            {copiedId === link.id ? (
                              <Check className="w-3 h-3 text-green-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="font-semibold text-sm">
                            ฿{link.offer?.price.toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {link.offer?.marketplace === "LAZADA" ? (
                          <div
                            className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-sm mx-auto"
                            title="Lazada"
                          >
                            L
                          </div>
                        ) : link.offer?.marketplace === "SHOPEE" ? (
                          <div
                            className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shadow-sm mx-auto"
                            title="Shopee"
                          >
                            S
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`font-bold text-lg ${getClickColor(clicks)}`}
                          >
                            {clicks.toLocaleString()}
                          </span>
                          {clicks > avgClicks && clicks > 0 && (
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                              <TrendingUp className="w-3 h-3" />
                              <span className="text-[10px] font-medium">
                                Above avg
                              </span>
                            </div>
                          )}
                          {clicks < avgClicks && clicks > 0 && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <TrendingDown className="w-3 h-3" />
                              <span className="text-[10px]">Below avg</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(link.createdAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        className="text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/admin/campaigns/${link.campaign?.id}`
                                )
                              }
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Campaign
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                              <BarChart3 className="w-4 h-4 mr-2" />
                              Analytics
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
  );
}
