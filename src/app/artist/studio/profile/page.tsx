"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import ArtistProfileView from "@/modules/artist/profile/ui/views/artist-profile-view";

export default function Page() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  React.useEffect(() => {
    // Redirect if unauthenticated or not an Artist
    if (!isAuthenticated || user?.role !== UserRole.ARTIST) {
      router.replace("/");
    }
  }, [isAuthenticated, user?.role, router]);

  if (!isAuthenticated || user?.role !== UserRole.ARTIST) return null;

  return <ArtistProfileView />;
}
