import Link from "next/link";
import Image from "next/image";
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
import { Trophy } from "lucide-react";

interface TopProduct {
  id: string;
  title: string;
  imageUrl?: string;
  clicks: number;
}

interface TopProductsTableProps {
  products: TopProduct[];
  title?: string;
}

export function TopProductsTable({
  products,
  title = "Top Products",
}: TopProductsTableProps) {
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
            <Trophy className="h-5 w-5" />
            {title}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            Top {products.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No product data available yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right max-w-0">Clicks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Badge className={getRankBadge(index)}>#{index + 1}</Badge>
                  </TableCell>
                  <TableCell className="max-w-0">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="flex items-center gap-3 hover:underline min-w-0"
                    >
                      {product.imageUrl && (
                        <div className="relative h-10 w-10 rounded overflow-hidden shrink-0">
                          <Image
                            src={product.imageUrl}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span className="font-medium truncate block">
                        {product.title}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right font-semibold max-w-0">
                    {formatNumber(product.clicks)}
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
