"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import * as React from "react";

export interface ProfileHeaderProps {
  name: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  onChangeAvatar?: (file: File) => void;
  onChangeBackground?: (file: File) => void;
}

export default function ProfileHeader({
  name,
  avatarUrl,
  backgroundUrl,
  onChangeAvatar,
  onChangeBackground,
}: ProfileHeaderProps) {
  const initials = React.useMemo(() => {
    const parts = name.trim().split(" ");
    const letters = (parts[0]?.[0] || "").concat(parts[parts.length - 1]?.[0] || "");
    return letters.toUpperCase() || "U";
  }, [name]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChangeAvatar?.(file);
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChangeBackground?.(file);
  };

  return (
    <div className="w-full">
      {/* Background banner */}
      <div className="relative h-48 w-full overflow-hidden rounded-md md:h-60">
       
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ background:
                "linear-gradient(180deg, rgba(115, 81, 231, 0.67) 0%, rgba(127, 127, 127, 0) 100%)", backgroundImage: `url(${backgroundUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-background/10" />
         
       
        

        {/* Edit background button */}
        {onChangeBackground ? (
          <div className="absolute right-3 top-3 z-20">
            <input
              id="profile-bg-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBackgroundChange}
            />
            <Button
              asChild
              type="button"
              variant="ghost"
              size="iconMd"
              className="rounded-full bg-black/40 text-white hover:bg-black/60"
            >
              <label htmlFor="profile-bg-upload" className="cursor-pointer">
                <Camera className="size-5" />
              </label>
            </Button>
          </div>
        ) : null}

  {/* Avatar and basic info overlay */}
  <div className="absolute left-4 top-1/2 z-20 -translate-y-1/2 px-2 md:left-6 md:px-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-25 w-25  md:h-24 md:w-24">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              {/* Edit avatar button */}
              <input
                id="profile-avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <Button
                asChild
                type="button"
                size="iconSm"
                variant="secondary"
                className="absolute -bottom-2 -right-2 rounded-full shadow-md"
              >
                <label htmlFor="profile-avatar-upload" className="cursor-pointer">
                  <Camera className="size-4" />
                </label>
              </Button>
            </div>

            <div className=" pb-2 md:block">
              <h1 className="text-2xl font-bold leading-tight md:text-3xl">{name}</h1>
              <p className="text-sm text-muted-foreground">ID: 12345678</p>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
