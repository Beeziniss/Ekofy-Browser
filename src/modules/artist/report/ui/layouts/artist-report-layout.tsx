"use client";

import { ReactNode } from "react";

interface ArtistReportLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ArtistReportLayout({ children }: ArtistReportLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 space-y-6">
        {children}
      </div>
    </div>
  );
}