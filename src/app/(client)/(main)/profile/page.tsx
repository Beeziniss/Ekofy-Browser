"use client";

import ProfileView from "../../../../modules/client/profile/ui/views/profile-view";
import { Suspense } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/auth-services";

export default function Page() {
  const router = useRouter();
  const { isAuthenticated, user, clearUserData } = useAuthStore();

  const { mutate: logout } = useMutation({
    mutationFn: authApi.general.logout,
    onSettled: () => {
      // Always clear local state and go to login, even if server logout fails
      clearUserData();
      router.replace("/login");
    },
  });

  React.useEffect(() => {
    // If unauthenticated: go to client login
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    // If authenticated but wrong role: force logout and go to login
    if (user?.role !== UserRole.LISTENER) {
      logout();
    }
  }, [isAuthenticated, user?.role, router, logout]);

  if (!isAuthenticated || user?.role !== UserRole.LISTENER) return null;
  return (
    <Suspense fallback={<div className="p-4">Loading profile…</div>}>
      <ProfileView />
    </Suspense>
  );
}
