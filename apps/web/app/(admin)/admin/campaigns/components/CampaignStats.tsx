import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointerClick, Link as LinkIcon, Package, TrendingUp } from "lucide-react";

interface CampaignStatsProps {
  totalClicks: number;
  totalLinks: number;
  totalProducts: number;
}

export function CampaignStats({
  totalClicks,
  totalLinks,
  totalProducts,
}: CampaignStatsProps) {
  const avgClicksPerProduct = totalProducts > 0
    ? (totalClicks / totalProducts).toFixed(1)
    : "0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="border-2 hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clicks
            </CardTitle>
            <MousePointerClick className="w-4 h-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{totalClicks.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp className="w-3 h-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              {avgClicksPerProduct} per product
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Affiliate Links
            </CardTitle>
            <LinkIcon className="w-4 h-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">{totalLinks}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Generated tracking links
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Campaign Products
            </CardTitle>
            <Package className="w-4 h-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-purple-600">{totalProducts}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Products in campaign
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
