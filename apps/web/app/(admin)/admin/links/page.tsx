import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function LinksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Affiliate Links</h1>
          <p className="text-muted-foreground">
            Generate and track affiliate short links
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Generate Link
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Link Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Link generation and tracking features will be implemented in Phase
            6.3. You'll be able to create short links for products in campaigns,
            view click statistics, and copy links to share.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
