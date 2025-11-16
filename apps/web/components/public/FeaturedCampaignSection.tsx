import { Calendar, Package, Sparkles, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "./ProductCard";

interface Campaign {
  id: string;
  name: string;
  description?: string | null;
  startAt?: string | null;
  endAt?: string | null;
  campaignProducts: Array<{
    product: {
      id: string;
      title: string;
      imageUrl: string;
      offers: Array<{
        id: string;
        marketplace: "LAZADA" | "SHOPEE";
        storeName: string;
        price: number;
      }>;
    };
  }>;
  links: Array<{
    id: string;
    shortCode: string;
    offerId: string;
  }>;
}

interface FeaturedCampaignSectionProps {
  campaign: Campaign;
}

export function FeaturedCampaignSection({ campaign }: FeaturedCampaignSectionProps) {
  const products = campaign.campaignProducts.map((cp) => cp.product);
  const productsCount = products.length;

  const totalSavings = products.reduce((sum, product) => {
    const prices = product.offers.map((o) => o.price);
    const max = Math.max(...prices);
    const min = Math.min(...prices);
    return sum + (max - min);
  }, 0);

  return (
    <section id="campaigns" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        {/* Featured Badge */}
        <div className="flex justify-center mb-6">
          <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 text-sm shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Featured Campaign
          </Badge>
        </div>

        {/* Campaign Header Card */}
        <Card className="mb-12 border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                {campaign.name}
              </h2>

              {campaign.description && (
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                  {campaign.description}
                </p>
              )}

              {/* Campaign Stats */}
              <div className="flex flex-wrap justify-center gap-6 mb-6">
                {campaign.startAt && (
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium">
                      {new Date(campaign.startAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {campaign.endAt &&
                        ` - ${new Date(campaign.endAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                        })}`}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Package className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium">{productsCount} Products</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    <span className="font-medium">
                      Up to ฿{totalSavings.toLocaleString()} Savings
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              links={campaign.links}
              size="large"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
