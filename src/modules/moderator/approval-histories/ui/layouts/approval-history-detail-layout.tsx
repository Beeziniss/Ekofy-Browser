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
    <div className="min-h-screen bg-main-dark-bg text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          {description && (
            <p className="text-gray-400">{description}</p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}