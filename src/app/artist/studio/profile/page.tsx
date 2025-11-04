"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import ArtistProfileView from "@/modules/artist/profile/ui/views/artist-profile-view";
// import { use404Check, checkResourceExists } from "@/utils/404-utils";

export default function Page() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  React.useEffect(() => {
    // Check authentication and role, trigger 404 if invalid
    if (!isAuthenticated || user?.role !== UserRole.ARTIST) {
      // For auth-related issues, still redirect to home or login
      // But for missing resources (like artist profile not found), use 404
      router.replace("/");
    }
  }, [isAuthenticated, user?.role, router]);

  // Example: Use 404Check for missing data scenarios
  // use404Check(checkResourceExists.hasData(artistProfile));

  if (!isAuthenticated || user?.role !== UserRole.ARTIST) return null;

  return <ArtistProfileView />;
}
