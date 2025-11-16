"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-md border-b border-slate-200 dark:border-slate-800"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className={cn(
              "text-xl font-bold transition-colors",
              isScrolled
                ? "text-slate-900 dark:text-white"
                : "text-white drop-shadow-lg"
            )}>
              DealFinder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={cn(
                "font-medium transition-colors hover:text-indigo-600",
                isScrolled
                  ? "text-slate-700 dark:text-slate-300"
                  : "text-white"
              )}
            >
              Home
            </Link>
            <Link
              href="/#campaigns"
              className={cn(
                "font-medium transition-colors hover:text-indigo-600",
                isScrolled
                  ? "text-slate-700 dark:text-slate-300"
                  : "text-white"
              )}
            >
              Campaigns
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              isScrolled
                ? "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                : "text-white hover:bg-white/10"
            )}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-slate-700 dark:text-slate-300 font-medium hover:text-indigo-600 px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/#campaigns"
                className="text-slate-700 dark:text-slate-300 font-medium hover:text-indigo-600 px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Campaigns
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
