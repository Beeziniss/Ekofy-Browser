"use client";

import { cn } from "@/lib/utils";

interface TrackApprovalLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function TrackApprovalLayout({
  title,
  description,
  children,
  className,
}: TrackApprovalLayoutProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}