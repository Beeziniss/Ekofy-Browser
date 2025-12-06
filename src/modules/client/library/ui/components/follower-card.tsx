import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userFollowMutationOptions, userUnfollowMutationOptions } from "@/gql/options/client-mutation-options";
import { useAuthStore } from "@/store";
import { WarningAuthDialog } from "@/modules/shared/ui/components/warning-auth-dialog";
import { UserRole } from "@/gql/graphql";

interface FollowerCardProps {
  follower: {
    id: string;
    fullName: string;
    checkUserFollowing: boolean;
    role: UserRole;
  };
}

const FollowerCard = ({ follower }: FollowerCardProps) => {
  const [showFollowWarning, setShowFollowWarning] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  // Check if current user is viewing their own profile
  const isSelf = user?.userId === follower.id;

  // Check if the follower is an artist (only artists can be followed)
  const isArtist = follower.role === UserRole.Artist;

  // State for follow status with optimistic updates
  const [isFollowing, setIsFollowing] = useState(follower.checkUserFollowing || false);

  // Follow user mutation
  const { mutate: followUser, isPending: isFollowPending } = useMutation({
    ...userFollowMutationOptions,
    onMutate: async () => {
      // Optimistic update
      setIsFollowing(!isFollowing);
    },
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["follower-infinite"],
      });
      toast.success(isFollowing ? "Unfollowed successfully!" : "Followed successfully!");
    },
    onError: () => {
      // Revert optimistic update on error
      setIsFollowing(isFollowing);
      toast.error("Failed to update follow status. Please try again.");
    },
  });

  // Unfollow user mutation
  const { mutate: unfollowUser, isPending: isUnfollowPending } = useMutation({
    ...userUnfollowMutationOptions,
    onMutate: async () => {
      // Optimistic update
      setIsFollowing(!isFollowing);
    },
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["follower-infinite"],
      });
      toast.success(isFollowing ? "Unfollowed successfully!" : "Followed successfully!");
    },
    onError: () => {
      // Revert optimistic update on error
      setIsFollowing(isFollowing);
      toast.error("Failed to update follow status. Please try again.");
    },
  });

  // Handle follow button click
  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowFollowWarning(true);
      return;
    }

    if (isFollowPending || isUnfollowPending || isSelf || !isArtist) return; // Prevent multiple clicks, self-follow, and non-artist follow

    if (isFollowing) {
      unfollowUser(follower.id);
    } else {
      followUser(follower.id);
    }
  };

  // Get user's first letter for avatar
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Format role display
  const formatRole = (role: UserRole) => {
    switch (role) {
      case UserRole.Artist:
        return "Artist";
      case UserRole.Listener:
        return "Listener";
      case UserRole.Admin:
        return "Admin";
      case UserRole.Moderator:
        return "Moderator";
      default:
        return "User";
    }
  };

  return (
    <div key={follower.id} className="flex w-full flex-col space-y-2.5">
      <div className="group relative flex aspect-square w-full cursor-pointer items-center justify-center rounded-full transition-opacity after:absolute after:inset-0 after:rounded-full after:bg-black after:opacity-0 after:content-[''] hover:after:opacity-20">
        {/* Avatar circle with first letter */}
        <div className="bg-main-card-bg flex aspect-square h-full w-full items-center justify-center rounded-full text-4xl font-bold text-white">
          {getInitials(follower.fullName)}
        </div>

        {/* Follow button - only show if not self and is an artist */}
        {!isSelf && isArtist && (
          <div className="absolute right-2 bottom-2">
            <Button
              onClick={handleFollowClick}
              className="bg-main-white hover:bg-main-white z-10 flex size-10 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            >
              <HeartIcon
                className={`size-4 ${isFollowing ? "text-main-purple fill-main-purple" : "text-main-dark-bg"}`}
              />
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-y-1 text-center">
        <p className="text-main-white hover:text-main-purple cursor-pointer text-sm hover:underline">
          {follower.fullName}
        </p>
        <p className="text-main-grey text-xs">{formatRole(follower.role)}</p>
      </div>

      {/* Authentication Warning Dialog */}
      <WarningAuthDialog open={showFollowWarning} onOpenChange={setShowFollowWarning} action="follow" />
    </div>
  );
};

export default FollowerCard;
