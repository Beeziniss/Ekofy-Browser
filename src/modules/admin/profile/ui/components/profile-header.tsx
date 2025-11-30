"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { UserProfile } from "@/types/profile";

interface ProfileHeaderProps {
  userProfile: UserProfile;
  onEditClick: () => void;
}

const ProfileHeader = ({ userProfile, onEditClick }: ProfileHeaderProps) => {
  const getInitials = (email: string) => {
    const name = email.split("@")[0];
    return name
      .split(".")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Extract name from email for display (since we don't have fullName in GraphQL response)
  // const displayName = userProfile.email.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {/* <AvatarImage src="/placeholder-avatar.png" alt={displayName} /> */}
          <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-600 text-lg font-semibold text-white">
            {getInitials(userProfile.email)}
          </AvatarFallback>
        </Avatar>

        <div>
          <h1 className="text-2xl font-bold text-white">{userProfile.fullName}</h1>
          <p className="text-gray-400">{userProfile.email}</p>
        </div>
      </div>

      {/* Edit button hidden as per requirement */}
      {/* <Button
        onClick={onEditClick}
        variant="destructive"
        size="lg"
        className="primary_gradient flex items-center gap-2 hover:opacity-60"
      >
        <Edit className="h-4 w-4" />
        Edit
      </Button> */}
    </div>
  );
};

export default ProfileHeader;
