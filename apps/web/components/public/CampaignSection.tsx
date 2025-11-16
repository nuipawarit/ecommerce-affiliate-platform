import { Calendar, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

interface CampaignSectionProps {
  campaign: Campaign;
}

export function CampaignSection({ campaign }: CampaignSectionProps) {
  const products = campaign.campaignProducts.map((cp) => cp.product);
  const productsCount = products.length;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Campaign Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {campaign.name}
            </h2>
            <Badge variant="secondary" className="h-7">
              {productsCount} {productsCount === 1 ? "Product" : "Products"}
            </Badge>
          </div>

          {campaign.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-3xl">
              {campaign.description}
            </p>
          )}

          {/* Campaign Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {campaign.startAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(campaign.startAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {campaign.endAt &&
                    ` - ${new Date(campaign.endAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}`}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>{productsCount} Products</span>
            </div>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              links={campaign.links}
              size="compact"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
