"use client";
import { ReactNode } from "react";
import { ModeratorGlobalAudioControls } from "../components";

interface TrackApprovalLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function TrackApprovalLayout({
  title,
  description,
  children,
}: TrackApprovalLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="pb-6">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        
        {/* Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
      
      {/* Audio Controls Footer - sticky at bottom */}
      <ModeratorGlobalAudioControls />
    </div>
  );
}