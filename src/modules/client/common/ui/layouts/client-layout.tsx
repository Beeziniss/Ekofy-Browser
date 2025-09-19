import React from "react";
import ClientHeader from "../components/client-header";
import PlaybackControl from "../components/playback-control/playback-control";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <div className="h-full w-full pt-[66px] pb-12">
      {/* Header */}
      <ClientHeader />

      {/* Main Content */}
      <main className="px-3 py-8">{children}</main>

      {/* Playback Control */}
      <PlaybackControl />
    </div>
  );
};

export default ClientLayout;
