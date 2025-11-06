"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ModeratorUserManagementLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  showBackButton?: boolean;
}

export function ModeratorUserManagementLayout({
  children,
  title,
  description,
  showBackButton = false,
}: ModeratorUserManagementLayoutProps) {
  const router = useRouter();

  return (
    <div className="space-y-8 p-6">
      <div>
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        <h1 className="mb-2 text-3xl font-bold text-white">{title}</h1>
        <p className="text-gray-400">{description}</p>
      </div>
      {children}
    </div>
  );
}
