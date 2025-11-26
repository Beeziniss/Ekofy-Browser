"use client";

import { ReactNode } from "react";

interface ArtistReportLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ArtistReportLayout({ children }: ArtistReportLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto space-y-6 p-6">{children}</div>
    </div>
  );
}
