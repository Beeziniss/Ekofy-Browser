"use client";

import { ReactNode } from "react";

interface ReportDetailLayoutProps {
  header: ReactNode;
  mainContent: ReactNode;
  sidebar: ReactNode;
}

export function ReportDetailLayout({ header, mainContent, sidebar }: ReportDetailLayoutProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      {header}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - Left Side (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          {mainContent}
        </div>

        {/* Sidebar - Right Side (1/3) */}
        {sidebar}
      </div>
    </div>
  );
}
