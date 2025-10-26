"use client";

import { ReactNode } from "react";

interface RequestHubLayoutProps {
  children: ReactNode;
}

export function RequestHubLayout({ children }: RequestHubLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {children}
      </div>
    </div>
  );
}