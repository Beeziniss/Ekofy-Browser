"use client";

import ProfileHeader from "@/modules/client/profile/ui/components/profile-header";
import React from "react";
import Tab from "../components/tabs/tabs";
import { useArtistProfile } from "../../../profile/hooks/use-artist-profile";
import MainLoader from "@/components/main-loader";
import { useCloudinaryUpload } from "@/modules/artist/sign-up/hooks/use-cloudinary-upload";
import { toast } from "sonner";
import { execute } from "@/gql/execute";
import { UpdateArtistProfileMutation } from "./queries";
import { useAuthStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { artistProfileOptions } from "@/gql/options/artist-options";

const ArtistProfileView = () => {
  const { header, isLoading, isFetching, error } = useArtistProfile();
  const { user } = useAuthStore();
  const userId = user?.userId || "";
  const queryClient = useQueryClient();
  const { uploadProfile } = useCloudinaryUpload();
  const CLOUDINARY_READY =
    !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

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

  const handleAvatar = async (file: File) => {
    try {
      if (!userId) {
        toast.error("You need to sign in to update your avatar.");
        return;
      }
      if (!CLOUDINARY_READY) {
        toast.error("Cloudinary is not configured. Please set environment variables and try again.");
        return;
      }
      const uploaded = await uploadProfile(file, userId, "avatar");
      if (!uploaded?.secure_url) return;

      await execute(UpdateArtistProfileMutation, {
        updateArtistRequest: { avatarImage: uploaded.secure_url },
      });

      toast.success("Your avatar has been updated.");
  queryClient.invalidateQueries({ queryKey: artistProfileOptions(userId).queryKey });
    } catch (e) {
      const raw = e instanceof Error ? e.message : String(e);
      // Friendly error for common cases
      const msg =
        /401|Unauthorized/i.test(raw)
          ? "You’re not authorized. Please sign in and try again."
          : /403|AUTH_NOT_AUTHORIZED/i.test(raw)
          ? "You don’t have permission to update this profile."
          : /Network Error/i.test(raw)
          ? "Network issue while updating your avatar. Please check your connection and retry."
          : "Couldn’t update your avatar right now. Please try again in a moment.";
      console.error("Avatar update failed:", raw);
      toast.error(msg);
    }
  };

  const handleBackground = async (file: File) => {
    try {
      if (!userId) {
        toast.error("You need to sign in to update your banner.");
        return;
      }
      if (!CLOUDINARY_READY) {
        toast.error("Cloudinary is not configured. Please set environment variables and try again.");
        return;
      }
      const uploaded = await uploadProfile(file, userId, "banner");
      if (!uploaded?.secure_url) return;

      await execute(UpdateArtistProfileMutation, {
        updateArtistRequest: { bannerImage: uploaded.secure_url },
      });

      toast.success("Your banner has been updated.");
  queryClient.invalidateQueries({ queryKey: artistProfileOptions(userId).queryKey });
    } catch (e) {
      const raw = e instanceof Error ? e.message : String(e);
      const msg =
        /401|Unauthorized/i.test(raw)
          ? "You’re not authorized. Please sign in and try again."
          : /403|AUTH_NOT_AUTHORIZED/i.test(raw)
          ? "You don’t have permission to update this profile."
          : /Network Error/i.test(raw)
          ? "Network issue while updating your banner. Please check your connection and retry."
          : "Couldn’t update your banner right now. Please try again in a moment.";
      console.error("Banner update failed:", raw);
      toast.error(msg);
    }
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
