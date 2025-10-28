"use client";

import { ReactNode } from "react";
import { ModeratorGlobalAudioControls } from "../components";

interface TrackDetailLayoutProps {
  children: ReactNode;
}

export function TrackDetailLayout({ children }: TrackDetailLayoutProps) {
  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="flex-1">
        {children}
      </main>
      
      {/* Audio Controls Footer for Track Detail - nằm trong content area, tránh sidebar */}
      <ModeratorGlobalAudioControls />
    </div>
  );
}