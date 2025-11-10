"use client";

import DetailView from "./detail-view";
import HelpCard from "../components/help-card";
import { useClientProfile } from "../../hooks/use-client-profile";
import ProfileHeader from "../components/profile-header";
import { useAuthStore } from "@/store";

export default function ProfileView() {
  const profileData = useClientProfile();
  const { personal, account, avatarImage, bannerImage } = profileData;
  const { user } = useAuthStore();

  const profileHeader = {
    name: personal.displayName || personal.email || "User",
    avatarUrl: avatarImage || "",
    backgroundUrl: bannerImage || "/image-login.png",
    userId: user?.userId || "",
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
      <ProfileHeader
        name={profileHeader.name}
        avatarUrl={profileHeader.avatarUrl}
        backgroundUrl={profileHeader.backgroundUrl}
        userId={profileHeader.userId}
      />

      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:pt-4">
          <div className="md:col-span-9">
            <DetailView personal={personal} account={account} userId={user?.userId} />
          </div>
          <div className="md:col-span-3">
            <HelpCard className="md:sticky md:top-18" />
          </div>
        </div>
      </div>
    </div>
  );
}
