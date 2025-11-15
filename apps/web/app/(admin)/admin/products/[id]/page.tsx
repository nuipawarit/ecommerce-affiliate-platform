import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { RefreshButton } from "../components/RefreshButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Offer {
  id: string;
  marketplace: string;
  storeName: string;
  price: number;
  url: string;
  lastCheckedAt: string;
}

interface Product {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  offers: Offer[];
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const lowestPrice = product.offers.length > 0
    ? Math.min(...product.offers.map((o) => o.price))
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Product Details
            </h1>
            <p className="text-muted-foreground">
              View and manage product information
            </p>
          </div>
          <RefreshButton productId={product.id} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold">{product.title}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Product ID</p>
                <p className="font-mono">{product.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Offers</p>
                <p className="font-medium">{product.offers.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Added</p>
                <p>{new Date(product.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p>{new Date(product.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Price Comparison</h2>
        {product.offers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No offers available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {product.offers.map((offer) => (
              <Card key={offer.id} className="relative">
                {offer.price === lowestPrice && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500 hover:bg-green-600">
                      Best Price
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="capitalize">
                      {offer.marketplace}
                    </CardTitle>
                    <Badge variant="outline" className="capitalize">
                      {offer.marketplace}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Store</p>
                    <p className="font-medium">{offer.storeName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-3xl font-bold">
                      ฿{offer.price.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Last Checked
                    </p>
                    <p className="text-sm">
                      {new Date(offer.lastCheckedAt).toLocaleString()}
                    </p>
                  </div>

                  <Link href={offer.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on {offer.marketplace}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
