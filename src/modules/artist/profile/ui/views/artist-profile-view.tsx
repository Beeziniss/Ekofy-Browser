"use client";

import ProfileHeader from "@/modules/client/profile/ui/components/profile-header";
import React from "react";
import Tab from "../components/tabs/tabs";
import { useArtistProfile } from "../../../profile/hooks/use-artist-profile";
import MainLoader from "@/components/main-loader";

const ArtistProfileView = () => {
  const { header, isLoading, isFetching, error } = useArtistProfile();

  if (isLoading || isFetching) {
    return <MainLoader />;
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
        <p className="text-sm text-red-500">Failed to load artist profile.</p>
      </div>
    );
  }

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
      <Tab />
    </div>
  );
};

export default ArtistProfileView;
