"use client";

import { ReactNode } from "react";

interface EntitlementLayoutProps {
  children: ReactNode;
}

export function EntitlementLayout({ children }: EntitlementLayoutProps) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}

