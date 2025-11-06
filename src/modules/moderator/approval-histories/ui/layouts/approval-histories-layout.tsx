"use client";

import { ReactNode } from "react";

interface ApprovalHistoriesLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function ApprovalHistoriesLayout({
  children,
  title = "Approval Histories",
  description,
}: ApprovalHistoriesLayoutProps) {
  return (
    <div className="bg-main-dark-bg min-h-screen text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-white">{title}</h1>
          {description && <p className="text-gray-400">{description}</p>}
        </div>

        {/* Content */}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
