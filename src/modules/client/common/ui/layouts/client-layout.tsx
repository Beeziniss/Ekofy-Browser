import React from "react";
import ClientHeader from "../components/client-header";
import PlaybackControl from "../components/playback-control/playback-control";
import AudioPlayer from "../components/audio/audio-player";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <div className="h-full w-full pt-16 pb-12">
      {/* Header */}
      <ClientHeader />

      {/* Main Content */}
      <main>{children}</main>

      {/* Playback Control */}
      <PlaybackControl />

      {/* Audio Player (Hidden) */}
      <AudioPlayer />
    </div>
  );
};

export default ClientLayout;
