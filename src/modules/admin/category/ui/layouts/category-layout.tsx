"use client";

import { ReactNode } from "react";

interface CategoryLayoutProps {
  children: ReactNode;
}

export function CategoryLayout({ children }: CategoryLayoutProps) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}
