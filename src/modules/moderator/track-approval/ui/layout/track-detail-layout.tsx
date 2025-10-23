"use client";

import { ReactNode } from "react";
import { ModeratorGlobalAudioControls, ModeratorGlobalAudioPlayer } from "../components";

interface TrackDetailLayoutProps {
  children: ReactNode;
}

export function TrackDetailLayout({ children }: TrackDetailLayoutProps) {
  return (
    <div className="min-h-screen bg-background">

      <main className="flex-1">
              {/* Global Audio Player - Hidden audio element */}
      <ModeratorGlobalAudioPlayer />
        {children}
              {/* Audio Controls Footer - chỉ trong Track Approval Center */}
      <ModeratorGlobalAudioControls />
      </main>

    </div>
  );
}