"use client";

import { ReactNode } from "react";
import { ModeratorGlobalAudioControls } from "../components";

interface TrackDetailLayoutProps {
  children: ReactNode;
}

export function TrackDetailLayout({ children }: TrackDetailLayoutProps) {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>

      {/* Audio Controls Footer - sticky at bottom */}
      <ModeratorGlobalAudioControls />
    </div>
  );
}
