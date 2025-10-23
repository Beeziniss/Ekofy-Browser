"use client";
import { ReactNode } from "react";
import { ModeratorGlobalAudioPlayer, ModeratorGlobalAudioControls } from "../components";

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
      <div className="container mx-auto px-6 py-8">

      {/* Global Audio Player - Hidden audio element */}
      <ModeratorGlobalAudioPlayer />
      
      {/* Header */}
      <div className="pb-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      {/* Content */}
      <div className="space-y-6">
        {children}
      </div>
      
      {/* Audio Controls Footer - chỉ trong Track Approval Center */}
      <ModeratorGlobalAudioControls />
      </div>
    </div>
  );
}