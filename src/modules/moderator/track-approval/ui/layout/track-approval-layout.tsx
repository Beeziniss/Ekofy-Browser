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
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8 pb-24">
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
      
      {/* Audio Controls Footer - nằm trong content area, tránh sidebar */}
      <ModeratorGlobalAudioControls />
    </div>
  );
}