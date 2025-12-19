"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import AlbumViews from "@/modules/client/albums/ui/views/album-views";

const Page = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user?.role !== UserRole.ARTIST) {
      router.replace("/unauthorized");
    }
  }, [isAuthenticated, user?.role, router]);

  // Don't render content for non-artists
  if (!isAuthenticated || user?.role !== UserRole.ARTIST) {
    return null;
  }

  return <AlbumViews />;
};

export default Page;
