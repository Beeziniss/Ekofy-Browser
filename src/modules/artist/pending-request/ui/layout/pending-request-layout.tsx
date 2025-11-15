"use client";

import { ReactNode } from "react";

interface PendingRequestLayoutProps {
  children: ReactNode;
}

export function PendingRequestLayout({ children }: PendingRequestLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1 px-6 py-6">
        {children}
      </main>
    </div>
  );
}