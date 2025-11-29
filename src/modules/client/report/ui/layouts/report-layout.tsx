"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

interface ReportLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
}

export function ReportLayout({
  children,
  title = "My Reports",
  description = "Manage and track violation reports that you have created",
  showBackButton = true,
  backHref = "/profile",
  backLabel = "Back to Profile",
}: ReportLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {showBackButton && (
            <Link
              href={backHref}
              className="hover:border-main-white flex items-center gap-x-2 pb-0.5 text-sm font-normal transition hover:border-b"
            >
              <ArrowLeftIcon className="size-4" /> {backLabel}
            </Link>
          )}
        </div>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}