"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getMarketplaceColor,
  getMarketplaceName,
  formatPercentage,
} from "@/lib/analytics-utils";

interface MarketplaceChartProps {
  data: Record<string, number>;
  title?: string;
}

export function MarketplaceChart({
  data,
  title = "Clicks by Marketplace",
}: MarketplaceChartProps) {
  const totalClicks = Object.values(data).reduce((sum, count) => sum + count, 0);

  const chartData = Object.entries(data).map(([marketplace, clicks]) => ({
    name: getMarketplaceName(marketplace),
    clicks,
    percentage: totalClicks > 0 ? (clicks / totalClicks) * 100 : 0,
    color: getMarketplaceColor(marketplace),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-xs" stroke="#888888" />
            <YAxis
              type="category"
              dataKey="name"
              className="text-xs"
              stroke="#888888"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold">{data.name}</span>
                        <span className="text-sm text-muted-foreground">
                          Clicks: {data.clicks}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Share: {formatPercentage(data.percentage)}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="clicks" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex flex-col gap-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">{item.clicks}</span>
                <span className="text-muted-foreground">
                  {formatPercentage(item.percentage)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
