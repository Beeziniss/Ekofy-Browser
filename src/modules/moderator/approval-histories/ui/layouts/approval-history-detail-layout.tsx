"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ApprovalHistoryDetailLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function ApprovalHistoryDetailLayout({
  children,
  title = "Approval History Detail",
  description,
}: ApprovalHistoryDetailLayoutProps) {
  const router = useRouter();

  return (
    <div className="bg-main-dark-bg min-h-screen text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          <h1 className="mb-2 text-3xl font-bold text-white">{title}</h1>
          {description && <p className="text-gray-400">{description}</p>}
        </div>

        {/* Content */}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
