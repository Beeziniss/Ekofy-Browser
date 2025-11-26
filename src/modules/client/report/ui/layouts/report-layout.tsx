"use client";

import { ReactNode } from "react";

interface ReportLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function ReportLayout({
  children,
  title = "My Reports",
  description = "Manage and track violation reports that you have created",
}: ReportLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}