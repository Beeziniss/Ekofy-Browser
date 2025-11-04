"use client";

import { useAuthStore } from "@/store";
import UnauthenticatedMessage from "../components/unauthenticated-message";
import AuthenticatedPlaylistSection from "../components/authenticated-playlist-section";

const PlaylistSection = () => {
  const { user, isAuthenticated } = useAuthStore();

  // If user is not authenticated, show the unauthenticated message
  if (!isAuthenticated || !user) {
    return <UnauthenticatedMessage />;
  }

  // If authenticated, render the authenticated playlist section with suspense queries
  return <AuthenticatedPlaylistSection />;
};

export default PlaylistSection;
