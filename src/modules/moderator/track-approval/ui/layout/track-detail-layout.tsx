"use client";

import { ReactNode } from "react";
import { ModeratorGlobalAudioControls } from "../components";

interface TrackDetailLayoutProps {
  children: ReactNode;
}

export function TrackDetailLayout({ children }: TrackDetailLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {children}
      </main>
      
      {/* Audio Controls Footer - sticky at bottom */}
      <ModeratorGlobalAudioControls />
    </div>
  );
}