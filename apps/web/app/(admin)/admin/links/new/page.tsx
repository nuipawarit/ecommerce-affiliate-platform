import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkGeneratorForm } from "../components/LinkGeneratorForm";

export default function NewLinkPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/links">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Generate Affiliate Link</h1>
          <p className="text-muted-foreground">
            Create a trackable short link for your campaign products
          </p>
        </div>
      </div>

      <LinkGeneratorForm />
    </div>
  );
}
