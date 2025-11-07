"use client";

import React from "react";
import { useAuthStore } from "@/store";
import Tab from "../components/tabs/tabs";
import ArtistProfileHeader from "../components/artist-profile-header";
import { useArtistProfile } from "../../../profile/hooks/use-artist-profile";

const ArtistProfileView = () => {
  const artistProfileData = useArtistProfile();
  const { header, isSolo, ...restData } = artistProfileData;
  const { user } = useAuthStore();

  // Prepare artist data for child components
  const artistData = {
    members: (restData.members || []).map((member) => ({
      fullName: member.fullName,
      email: member.email,
      isLeader: member.isLeader,
    })),
    data: restData.data
      ? {
          stageName: restData.data.stageName,
        }
      : undefined,
    createdAt: restData.createdAt,
    userStatus: restData.userStatus as string,
    artistType: restData.artistType as string,
    membershipStatus: restData.membershipStatus,
    identityCard: restData.identityCard
      ? {
          number: restData.identityCard.number,
          fullName: restData.identityCard.fullName,
          dateOfBirth: restData.identityCard.dateOfBirth,
          gender: restData.identityCard.gender,
          placeOfOrigin: restData.identityCard.placeOfOrigin,
          placeOfResidence: {
            addressLine: restData.identityCard.placeOfResidence?.addressLine || undefined,
          },
          validUntil: restData.identityCard.validUntil,
        }
      : undefined,
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
      <ArtistProfileHeader
        name={header.name}
        avatarUrl={header.avatarUrl}
        backgroundUrl={header.backgroundUrl}
        userId={user?.userId || ""}
      />
      <Tab isSolo={isSolo} artistData={artistData} />
    </div>
  );
};

export default ArtistProfileView;
