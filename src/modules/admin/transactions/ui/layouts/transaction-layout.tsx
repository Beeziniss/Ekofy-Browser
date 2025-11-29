"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface TransactionLayoutProps {
  children: ReactNode;
  showBackButton?: boolean;
}

export function TransactionLayout({
  children,
  showBackButton = false,
}: TransactionLayoutProps) {
  const router = useRouter();

  return (
    <div className="bg-main-dark-bg min-h-screen text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div>
          {showBackButton && (
            <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-gray-400 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          
          
        </div>

        {/* Content */}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
