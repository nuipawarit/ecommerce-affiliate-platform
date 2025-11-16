"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import {
  getBestMarketplace,
  getMarketplaceColor,
  getMarketplaceName,
  formatNumber,
  formatPercentage,
} from "@/lib/analytics-utils";

interface MarketplacePerformanceCardProps {
  data: Record<string, number>;
}

export function MarketplacePerformanceCard({
  data,
}: MarketplacePerformanceCardProps) {
  const bestMarketplace = getBestMarketplace(data);

  if (!bestMarketplace) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Best Marketplace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const marketplaceColor = getMarketplaceColor(bestMarketplace.marketplace);
  const marketplaceName = getMarketplaceName(bestMarketplace.marketplace);
  const isLazada = bestMarketplace.marketplace.toLowerCase() === "lazada";

  const borderColorClass = isLazada
    ? "border-blue-900/50"
    : "border-orange-500/50";
  const bgColorClass = isLazada ? "bg-blue-50/50" : "bg-orange-50/50";
  const textColorClass = isLazada ? "text-blue-900" : "text-orange-600";
  const badgeBgClass = isLazada ? "bg-blue-900" : "bg-orange-500";

  return (
    <Card className={`border-2 hover:shadow-md transition-shadow ${borderColorClass} ${bgColorClass}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Best Marketplace
          </CardTitle>
          <TrendingUp className={`w-4 h-4 ${textColorClass}`} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: marketplaceColor }}
          />
          <p className={`text-2xl font-bold ${textColorClass}`}>
            {marketplaceName}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {formatNumber(bestMarketplace.clicks)} clicks
          </p>
          <Badge className={`${badgeBgClass} hover:${badgeBgClass} text-white`}>
            {formatPercentage(bestMarketplace.percentage, 1)} of total
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
