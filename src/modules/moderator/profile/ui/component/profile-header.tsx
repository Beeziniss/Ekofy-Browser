"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const displayName = userProfile.email.split("@")[0].replace(".", " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {/* <AvatarImage src="/placeholder-avatar.png" alt={displayName} /> */}
          <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-purple-400 to-blue-600 text-white">
            {getInitials(userProfile.email)}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h1 className="text-2xl font-bold text-white">{displayName}</h1>
          <p className="text-gray-400">{userProfile.email}</p>
        </div>
      </div>

      <Button 
        onClick={onEditClick}
        variant="destructive"
        size="lg"
        className="flex items-center gap-2 primary_gradient hover:opacity-60"
      >
        <Edit className="h-4 w-4" />
        Edit
      </Button>
    </div>
  );
};

export default ProfileHeader;