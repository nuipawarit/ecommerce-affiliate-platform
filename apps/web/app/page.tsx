import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart3, Link as LinkIcon, Package } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Affiliate Platform
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Compare prices from Lazada and Shopee, create marketing campaigns,
              and track affiliate link performance
            </p>
          </div>

          <div className="flex gap-4">
            <Link href="/admin/dashboard">
              <Button size="lg">
                Go to Admin Panel
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mt-16 w-full max-w-4xl">
            <Card>
              <CardHeader>
                <Package className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Product Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add products from Lazada and Shopee URLs. Compare prices
                  across marketplaces automatically.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <LinkIcon className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Affiliate Links</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate short affiliate links with UTM tracking. Monitor
                  clicks in real-time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track campaign performance with detailed analytics and
                  insights.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
