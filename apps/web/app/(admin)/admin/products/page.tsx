import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage products from Lazada and Shopee
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Product list and management features will be implemented in Phase
            6.2. You'll be able to add products from Lazada/Shopee URLs, view
            price comparisons, and manually refresh prices.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
