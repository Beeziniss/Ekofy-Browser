"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ArtistReportLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ArtistReportLayout({ children, className }: ArtistReportLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50",
      "dark:from-purple-950/20 dark:via-pink-950/20 dark:to-rose-950/20",
      className
    )}>
      <div className="container mx-auto p-6 space-y-6">
        {children}
      </div>
    </div>
  );
}