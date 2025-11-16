"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  const scrollToCampaigns = () => {
    const element = document.getElementById("campaigns");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      {/* Content */}
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <Badge variant="outline" className="mb-8 px-4 py-2 text-sm font-medium border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 animate-fade-in-up">
            Compare Prices, Save More
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Find the Best Deals on{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Lazada & Shopee
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Compare prices across marketplaces in real-time and save money on every purchase
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <Button
              onClick={scrollToCampaigns}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-300 font-semibold px-8"
            >
              <Search className="w-5 h-5 mr-2" />
              Explore Deals
            </Button>
            <Button
              onClick={scrollToCampaigns}
              size="lg"
              variant="outline"
              className="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 font-semibold px-8"
            >
              See All Campaigns
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-700 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">1000+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Products</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">15%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Avg. Savings</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">50K+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Users</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
