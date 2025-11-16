import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/analytics-utils";
import { Megaphone } from "lucide-react";

interface TopCampaign {
  id: string;
  name: string;
  clicks: number;
}

interface TopCampaignsTableProps {
  campaigns: TopCampaign[];
  title?: string;
}

export function TopCampaignsTable({
  campaigns,
  title = "Top Campaigns",
}: TopCampaignsTableProps) {
  const getRankBadge = (index: number) => {
    if (index === 0) return "bg-yellow-500 hover:bg-yellow-600";
    if (index === 1) return "bg-gray-400 hover:bg-gray-500";
    if (index === 2) return "bg-orange-600 hover:bg-orange-700";
    return "bg-muted hover:bg-muted";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            {title}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            Top {campaigns.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {campaigns.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No campaign data available yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead className="text-right max-w-0">Clicks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign, index) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <Badge className={getRankBadge(index)}>#{index + 1}</Badge>
                  </TableCell>
                  <TableCell className="max-w-0">
                    <Link
                      href={`/admin/campaigns/${campaign.id}`}
                      className="font-medium hover:underline block truncate"
                    >
                      {campaign.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right max-w-0 font-semibold">
                    {formatNumber(campaign.clicks)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
