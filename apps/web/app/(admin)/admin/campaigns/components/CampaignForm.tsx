"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, AlertCircle, Info, Link2 } from "lucide-react";
import { apiPost, apiPut } from "@/lib/api-client";
import { ProductSelector } from "./ProductSelector";

import type { CampaignStatus } from "@repo/shared";

interface Campaign {
  id?: string;
  name: string;
  slug?: string;
  description?: string | null;
  status: CampaignStatus;
  startAt: string | null;
  endAt: string | null;
  utmCampaign: string;
}

interface CampaignFormProps {
  initialData?: Campaign & { productIds?: string[] };
  mode: "create" | "edit";
}

export function CampaignForm({ initialData, mode }: CampaignFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<Campaign>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    status: initialData?.status || "DRAFT",
    startAt: initialData?.startAt || null,
    endAt: initialData?.endAt || null,
    utmCampaign: initialData?.utmCampaign || "",
  });

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    initialData?.productIds || []
  );

  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.startAt ? new Date(initialData.startAt) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData?.endAt ? new Date(initialData.endAt) : undefined
  );

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const slug = generateSlug(value);
    setFormData((prev) => ({ ...prev, name: value, slug }));
    setError("");
  };

  const handleStatusChange = (value: CampaignStatus) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    setFormData((prev) => ({
      ...prev,
      startAt: date ? date.toISOString() : null,
    }));
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    setFormData((prev) => ({
      ...prev,
      endAt: date ? date.toISOString() : null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "create" && selectedProductIds.length === 0) {
      setError("Please select at least one product for this campaign");
      return;
    }

    if (startDate && endDate && endDate < startDate) {
      setError("End date must be after start date");
      return;
    }

    setLoading(true);

    try {
      const payload: Record<string, unknown> = {
        name: formData.name,
        description: formData.description || null,
        status: formData.status,
        startAt: formData.startAt,
        endAt: formData.endAt,
        utmCampaign: formData.utmCampaign,
      };

      if (mode === "create") {
        payload.productIds = selectedProductIds;
        await apiPost("/api/campaigns", payload);
      } else if (initialData?.id) {
        await apiPut(`/api/campaigns/${initialData.id}`, payload);
      }

      router.push("/admin/campaigns");
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save campaign";
      setError(errorMessage);
      console.error("Failed to save campaign:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    const now = new Date();
    const start = startDate || new Date();
    const end = endDate;

    if (formData.status === 'DRAFT') {
      return <Badge variant="outline" className="bg-gray-50">Draft</Badge>;
    }
    if (formData.status === 'PAUSED') {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Paused</Badge>;
    }
    if (formData.status === 'ENDED' || (end && end < now)) {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Ended</Badge>;
    }
    if (start > now) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
    }
    return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {formData.slug && mode === "create" && (
        <Alert>
          <Link2 className="h-4 w-4" />
          <AlertTitle>Campaign URL Preview</AlertTitle>
          <AlertDescription>
            <code className="text-sm bg-muted px-2 py-1 rounded">
              /campaign/{formData.slug}
            </code>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Campaign name and description for internal reference
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Campaign Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g., Summer Sale 2025, Black Friday Deals"
              required
              minLength={3}
            />
            <p className="text-xs text-muted-foreground">
              This will be used to generate the campaign URL
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              placeholder="Internal notes about this campaign..."
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Campaign Status *</Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-gray-50">Draft</Badge>
                    <span className="text-sm text-muted-foreground">Not visible to public</span>
                  </div>
                </SelectItem>
                <SelectItem value="ACTIVE">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                    <span className="text-sm text-muted-foreground">Live and visible</span>
                  </div>
                </SelectItem>
                <SelectItem value="PAUSED">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Paused</Badge>
                    <span className="text-sm text-muted-foreground">Temporarily hidden</span>
                  </div>
                </SelectItem>
                <SelectItem value="ENDED">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Ended</Badge>
                    <span className="text-sm text-muted-foreground">Campaign concluded</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Current status:</span>
              {getStatusBadge()}
            </div>
          </div>
        </CardContent>
      </Card>

      {mode === "create" && (
        <Card>
          <CardHeader>
            <CardTitle>Select Products *</CardTitle>
            <CardDescription>
              Choose products to promote in this campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductSelector
              selectedProductIds={selectedProductIds}
              onSelectionChange={setSelectedProductIds}
            />
            <p className="text-sm text-muted-foreground mt-2">
              {selectedProductIds.length === 0
                ? "Select at least one product to include in this campaign"
                : `${selectedProductIds.length} product${selectedProductIds.length === 1 ? "" : "s"} selected`}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Campaign Schedule</CardTitle>
          <CardDescription>
            Set start and end dates (optional for perpetual campaigns)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>No start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>No end date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDateChange}
                    initialFocus
                    disabled={(date) => startDate ? date < startDate : false}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Leave empty for perpetual campaigns that run indefinitely
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tracking Parameters</CardTitle>
          <CardDescription>
            UTM parameters for analytics and performance tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="utmCampaign">UTM Campaign *</Label>
            <Input
              id="utmCampaign"
              name="utmCampaign"
              value={formData.utmCampaign}
              onChange={handleInputChange}
              placeholder="e.g., summer-sale-2025, black-friday"
              required
            />
            <p className="text-xs text-muted-foreground">
              Primary identifier for tracking this campaign's performance in analytics
            </p>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              UTM parameters help track traffic sources and campaign effectiveness in Google Analytics.
              The utm_campaign parameter is required for proper tracking.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Campaign" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
