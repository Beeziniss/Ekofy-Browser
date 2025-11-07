"use client";

import * as React from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserInitials } from "@/utils/format-shorten-name";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileImageUpload } from "../../hooks/use-profile-image-upload";

export interface ProfileHeaderProps {
  name: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  userId?: string;
}

export default function ProfileHeader({ name, avatarUrl, backgroundUrl, userId = "" }: ProfileHeaderProps) {
  const { uploadAvatar, uploadBackground, isUploadingAvatar, isUploadingBackground } = useProfileImageUpload(userId);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAvatar(file);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleBackgroundChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadBackground(file);
      // Reset file input
      e.target.value = "";
    }
  };

  return (
    <div className="w-full">
      {/* Background banner */}
      <div
        className={`relative h-48 w-full overflow-hidden rounded-md md:h-60 ${isUploadingBackground ? "opacity-70" : ""}`}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            background: "linear-gradient(180deg, rgba(115, 81, 231, 0.67) 0%, rgba(127, 127, 127, 0) 100%)",
            backgroundImage: `url(${backgroundUrl})`,
          }}
        />
        <div className="from-background/80 via-background/40 to-background/10 absolute inset-0 bg-gradient-to-t" />

        {/* Edit background button */}
        <div className="absolute top-3 right-3 z-20">
          <input
            id="profile-bg-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBackgroundChange}
            disabled={isUploadingBackground}
          />
          <Button
            asChild
            type="button"
            variant="ghost"
            size="iconMd"
            className="rounded-full bg-black/40 text-white hover:bg-black/60"
            disabled={isUploadingBackground}
          >
            <label
              htmlFor="profile-bg-upload"
              className={`cursor-pointer ${isUploadingBackground ? "cursor-not-allowed" : ""}`}
            >
              {isUploadingBackground ? <Loader2 className="size-5 animate-spin" /> : <Camera className="size-5" />}
            </label>
          </Button>
        </div>

        {/* Avatar and basic info overlay */}
        <div className="absolute top-1/2 left-4 z-20 -translate-y-1/2 px-2 md:left-6 md:px-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className={`h-25 w-25 md:h-24 md:w-24 ${isUploadingAvatar ? "opacity-70" : ""}`}>
                {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
                <AvatarFallback className="text-xl font-semibold">{getUserInitials(name)}</AvatarFallback>
              </Avatar>

              {/* Edit avatar button */}
              <input
                id="profile-avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isUploadingAvatar}
              />
              <Button
                asChild
                type="button"
                size="iconSm"
                variant="secondary"
                className="absolute -right-2 -bottom-2 rounded-full shadow-md"
                disabled={isUploadingAvatar}
              >
                <label
                  htmlFor="profile-avatar-upload"
                  className={`cursor-pointer ${isUploadingAvatar ? "cursor-not-allowed" : ""}`}
                >
                  {isUploadingAvatar ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
                </label>
              </Button>
            </div>

            <div className="pb-2 md:block">
              <h1 className="text-2xl leading-tight font-bold md:text-3xl">{name}</h1>
              <p className="text-muted-foreground text-sm">ID: 12345678</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
