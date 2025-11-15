"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { apiPost } from "@/lib/api-client";

export default function NewProductPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [marketplace, setMarketplace] = useState<"lazada" | "shopee">("lazada");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiPost("/api/products", {
        url,
        marketplace,
      });

      router.push(`/admin/products/${response.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
        <p className="text-muted-foreground">
          Add a product from Lazada or Shopee by providing its URL
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Enter the product URL from Lazada or Shopee marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">Product URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://www.lazada.co.th/products/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Paste the full URL of the product from Lazada or Shopee
              </p>
            </div>

            <div className="space-y-2">
              <Label>Marketplace</Label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="lazada"
                    checked={marketplace === "lazada"}
                    onChange={(e) => setMarketplace(e.target.value as "lazada")}
                    disabled={loading}
                    className="h-4 w-4 text-primary"
                  />
                  <span className="text-sm font-medium">Lazada</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="shopee"
                    checked={marketplace === "shopee"}
                    onChange={(e) => setMarketplace(e.target.value as "shopee")}
                    disabled={loading}
                    className="h-4 w-4 text-primary"
                  />
                  <span className="text-sm font-medium">Shopee</span>
                </label>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={loading || !url}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Product
              </Button>
              <Link href="/admin/products">
                <Button type="button" variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
