"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { apiGet } from "@/lib/api-client";
import type { CampaignWithRelations, CampaignsListResponse } from "@repo/shared";

interface CampaignSelectorProps {
  selectedCampaignId: string | null;
  onCampaignChange: (campaignId: string | null) => void;
}

export function CampaignSelector({
  selectedCampaignId,
  onCampaignChange,
}: CampaignSelectorProps) {
  const [open, setOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const data = await apiGet<CampaignsListResponse>("/api/campaigns");
        const activeCampaigns = (data.campaigns || []).filter(
          (c) => c.status === "ACTIVE"
        );
        setCampaigns(activeCampaigns);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId);

  const handleSelect = (campaignId: string) => {
    if (selectedCampaignId === campaignId) {
      onCampaignChange(null);
    } else {
      onCampaignChange(campaignId);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCampaign ? (
            <span className="truncate">{selectedCampaign.name}</span>
          ) : (
            <span className="text-muted-foreground">Select campaign...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search campaigns..." />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading campaigns..." : "No active campaigns found."}
            </CommandEmpty>
            <CommandGroup>
              {campaigns.map((campaign) => (
                <CommandItem
                  key={campaign.id}
                  value={campaign.name}
                  onSelect={() => handleSelect(campaign.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCampaignId === campaign.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{campaign.name}</span>
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                        ACTIVE
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate">
                      /{campaign.slug}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
