import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage marketing campaigns
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Campaign list and creation features will be implemented in Phase
            6.3. You'll be able to create campaigns with UTM parameters, add
            products, and manage campaign dates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
