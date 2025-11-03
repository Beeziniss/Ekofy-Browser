"use client";

import ProfileHeader from "../components/profile-header";
import DetailView from "./detail-view";
import HelpCard from "../components/help-item";
import { useClientProfile } from "../../hooks/use-client-profile";
import * as React from "react";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";

export default function ProfileView() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { personal, ...rest } = useClientProfile();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;
  const header = {
    name: personal.displayName || personal.email || "User",
    avatarUrl: rest.data?.avatarImage || "",
    backgroundUrl: rest.data?.bannerImage || "/image-login.png",
  };

  const handleAvatar = (file: File) => {
    console.log("Avatar chọn:", file.name);
  };

  const handleBackground = (file: File) => {
    console.log("Background chọn:", file.name);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
      <ProfileHeader
        name={header.name}
        avatarUrl={header.avatarUrl}
        backgroundUrl={header.backgroundUrl}
        onChangeAvatar={handleAvatar}
        onChangeBackground={handleBackground}
      />

      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:pt-4">
          <div className="md:col-span-9">
            <DetailView />
          </div>
          <div className="md:col-span-3">
            <HelpCard className="md:sticky md:top-18" />
          </div>
        </div>
      </div>
    </div>
  );
}
