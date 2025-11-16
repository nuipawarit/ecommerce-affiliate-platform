"use client";

import { useEffect, useState, useCallback } from "react";
import { apiGet } from "@/lib/api-client";
import type { DashboardData } from "@repo/shared";
import { MetricCard } from "@/components/analytics/MetricCard";
import { ClicksChart } from "@/components/analytics/ClicksChart";
import { MarketplaceChart } from "@/components/analytics/MarketplaceChart";
import { MarketplacePerformanceCard } from "@/components/analytics/MarketplacePerformanceCard";
import { TopProductsTable } from "@/components/analytics/TopProductsTable";
import { TopCampaignsTable } from "@/components/analytics/TopCampaignsTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MousePointerClick,
  Target,
  Megaphone,
  Package,
  RefreshCw,
  AlertCircle,
  Calendar,
  Clock,
} from "lucide-react";
import { getDateRangeLabel } from "@/lib/analytics-utils";

export function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);
      const result = await apiGet<DashboardData>(
        `/api/analytics/dashboard?dateRange=${dateRange}`
      );
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const ctr =
    data && data.totalLinks > 0
      ? ((data.totalClicks / data.totalLinks) * 100).toFixed(1)
      : "0";

  const lastUpdated = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-48 md:col-span-1" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your affiliate platform performance
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={handleRefresh}>Try Again</Button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        <MetricCard
          title="Period"
          value={getDateRangeLabel(dateRange)}
          icon={Calendar}
          variant="compact"
          format="text"
        />
        <MetricCard
          title="Last Updated"
          value={lastUpdated}
          icon={Clock}
          variant="compact"
          format="text"
        />
        <MetricCard
          title="Campaigns"
          value={data.totalCampaigns}
          icon={Megaphone}
          variant="compact"
        />
        <MetricCard
          title="Products"
          value={data.totalProducts}
          icon={Package}
          variant="compact"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Clicks"
          value={data.totalClicks}
          icon={MousePointerClick}
          description="Across all campaigns"
          variant="hero"
          accentColor="green"
        />
        <MetricCard
          title="Click-Through Rate"
          value={`${ctr}%`}
          icon={Target}
          description="Average clicks per link"
          variant="hero"
          accentColor="blue"
          format="text"
        />
        <MarketplacePerformanceCard data={data.clicksByMarketplace} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data.clicksByDay.length > 0 ? (
          <ClicksChart data={data.clicksByDay} title="Clicks Trend (Last 30 Days)" />
        ) : (
          <Alert>
            <AlertDescription>
              No click data available for the selected period
            </AlertDescription>
          </Alert>
        )}
        {Object.keys(data.clicksByMarketplace).length > 0 ? (
          <MarketplaceChart data={data.clicksByMarketplace} />
        ) : (
          <Alert>
            <AlertDescription>
              No marketplace data available yet
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TopProductsTable products={data.topProducts} />
        <TopCampaignsTable campaigns={data.topCampaigns} />
      </div>
    </div>
  );
}
