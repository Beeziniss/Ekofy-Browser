"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface InvoiceLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  showHeader?: boolean;
}

export function InvoiceLayout({
  children,
  title = "My Invoices",
  description = "View and manage all your invoices and billing history",
  showBackButton = false,
  showHeader = true,
}: InvoiceLayoutProps) {
  const router = useRouter();

  return (
    <div className="bg-main-dark-bg min-h-screen text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        {showHeader && (
          <div className="mb-6">
            {showBackButton && (
              <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-gray-400 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            
            {(title || description) && (
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
                  {description && <p className="text-muted-foreground mt-1">{description}</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
