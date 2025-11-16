export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function formatPercentage(num: number, decimals: number = 1): string {
  return `${num.toFixed(decimals)}%`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function calculateCTR(clicks: number, impressions: number): number {
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;
}

export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function getMarketplaceColor(marketplace: string): string {
  const colors: Record<string, string> = {
    lazada: "#0f1c87",
    shopee: "#ee4d2d",
  };
  return colors[marketplace.toLowerCase()] || "#64748b";
}

export function getMarketplaceName(marketplace: string): string {
  const names: Record<string, string> = {
    lazada: "Lazada",
    shopee: "Shopee",
  };
  return names[marketplace.toLowerCase()] || marketplace;
}

export function getBestMarketplace(
  data: Record<string, number>
): { marketplace: string; clicks: number; percentage: number } | null {
  const entries = Object.entries(data);
  if (entries.length === 0) return null;

  const total = entries.reduce((sum, [, clicks]) => sum + clicks, 0);
  const best = entries.reduce(
    (max, [marketplace, clicks]) =>
      clicks > max.clicks ? { marketplace, clicks } : max,
    { marketplace: "", clicks: 0 }
  );

  return {
    marketplace: best.marketplace,
    clicks: best.clicks,
    percentage: total > 0 ? (best.clicks / total) * 100 : 0,
  };
}

export function formatGrowth(
  growth: number,
  options: { showSign?: boolean; showIcon?: boolean } = {}
): {
  text: string;
  isPositive: boolean;
  icon: "up" | "down" | "neutral";
} {
  const { showSign = true, showIcon = true } = options;
  const isPositive = growth > 0;
  const isNeutral = growth === 0;

  let text = `${Math.abs(growth).toFixed(1)}%`;
  if (showSign && !isNeutral) {
    text = `${isPositive ? "+" : "-"}${text}`;
  }

  return {
    text,
    isPositive,
    icon: isNeutral ? "neutral" : isPositive ? "up" : "down",
  };
}

export function getDateRangeLabel(dateRange: string): string {
  const labels: Record<string, string> = {
    last7days: "Last 7 Days",
    last30days: "Last 30 Days",
    all: "All Time",
  };
  return labels[dateRange] || dateRange;
}
