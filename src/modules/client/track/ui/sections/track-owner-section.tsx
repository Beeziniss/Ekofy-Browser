"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportRelatedContentType, PopularityActionType } from "@/gql/graphql";
import { formatNumber } from "@/utils/format-number";
import {
  CopyIcon,
  EllipsisIcon,
  FlagIcon,
  HeartIcon,
  ListPlusIcon,
  UserIcon,
  BarChart3Icon,
  InfoIcon,
} from "lucide-react";
import { Suspense, useState } from "react";
import PlaylistAddModal from "@/modules/client/playlist/ui/components/playlist-add-modal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getUserInitials } from "@/utils/format-shorten-name";
import Link from "next/link";
import { useArtistFollow } from "@/hooks/use-artist-follow";
import { useFavoriteTrack } from "@/modules/client/track/hooks/use-favorite-track";
import { WarningAuthDialog } from "@/modules/shared/ui/components/warning-auth-dialog";
import { useAuthAction } from "@/hooks/use-auth-action";
import { ReportDialog } from "@/modules/shared/ui/components/report-dialog";
import { useProcessTrackEngagementPopularity } from "@/gql/client-mutation-options/popularity-mutation-option";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { artistOptions, trackDetailOptions } from "@/gql/options/client-options";
import { useAuthStore } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface TrackOwnerSectionProps {
  trackId: string;
}

const TrackOwnerSection = ({ trackId }: TrackOwnerSectionProps) => {
  return (
    <Suspense fallback={<TrackOwnerSectionSkeleton />}>
      <TrackOwnerSectionSuspense trackId={trackId} />
    </Suspense>
  );
};

const TrackOwnerSectionSkeleton = () => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-x-3">
        <Skeleton className="size-16 rounded-full" />
        <div className="flex items-center gap-x-6">
          <div className="flex flex-col gap-y-1">
            <Skeleton className="h-5 w-32 rounded-full" />
            <Skeleton className="h-4 w-24 rounded-full" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>

      <div className="flex items-center gap-x-4">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
};

const TrackOwnerSectionSuspense = ({ trackId }: TrackOwnerSectionProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const { data } = useSuspenseQuery(trackDetailOptions(trackId));
  const { data: artistData } = useQuery({
    ...artistOptions({
      userId: user?.userId || "",
      artistId: user?.artistId || "",
    }),
    enabled: isAuthenticated && !!user?.userId && !!user?.artistId,
  });

  const trackDetail = data.tracks?.items?.[0];
  const trackDetailArtist = trackDetail?.mainArtists?.items?.[0];
  const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const { showWarningDialog, setShowWarningDialog, warningAction, trackName, executeWithAuth } = useAuthAction();
  const { mutate: trackEngagementPopularity } = useProcessTrackEngagementPopularity();

  const { handleFavorite } = useFavoriteTrack();

  const { handleFollowToggle } = useArtistFollow({
    artistId: trackDetailArtist?.id,
    trackId: trackDetail?.id,
  });

  const trackData = data.tracks?.items?.[0];

  // Check if current user is the track owner
  const isTrackOwner = artistData && artistData.artists?.items?.[0]?.userId === trackDetailArtist?.userId;

  const handleCopyLink = () => {
    if (trackDetail?.id) {
      const url = `${window.location.origin}/track/${trackDetail.id}`;
      navigator.clipboard.writeText(url);
      toast.success("Copied!");
      // Track popularity for share action
      trackEngagementPopularity({
        trackId: trackDetail.id,
        actionType: PopularityActionType.Share,
      });
    }
  };

  const handleFavoriteClick = () => {
    executeWithAuth(
      () => {
        if (!trackDetail?.id || !trackDetail?.name) return;

        handleFavorite({
          id: trackDetail.id,
          name: trackDetail.name,
          checkTrackInFavorite: trackDetail.checkTrackInFavorite,
        });
      },
      "favorite",
      trackDetail?.name,
    );
  };

  const handleFollowUserToggle = () => {
    executeWithAuth(() => {
      if (!trackDetailArtist?.userId) return;

      const isCurrentlyFollowing = trackDetailArtist?.user[0]?.checkUserFollowing;

      handleFollowToggle(trackDetailArtist.userId, isCurrentlyFollowing, trackDetailArtist.stageName);
    }, "follow");
  };

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-x-3">
          <Link href={`/artists/${trackData?.mainArtistIds?.[0]}/tracks`}>
            <Avatar className="size-16">
              <AvatarImage src={trackDetail?.mainArtists?.items?.[0].avatarImage || "https://github.com/shadcn.png"} />
              <AvatarFallback>{getUserInitials(trackDetail?.mainArtists?.items?.[0]?.stageName || "")}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex items-center gap-x-6">
            <div className="flex flex-col gap-y-1">
              <Link
                href={`/artists/${trackData?.mainArtistIds?.[0]}/tracks`}
                className="text-main-white hover:text-main-purple text-sm font-bold transition-colors"
              >
                {data.tracks?.items?.[0]?.mainArtists?.items?.[0]?.stageName || "Unknown Artist"}
              </Link>
              <span className="text-main-grey-dark-1 flex items-center gap-x-1 text-sm">
                <UserIcon className="inline-block size-5" /> {trackData?.mainArtists?.items?.[0]?.followerCount || 0}{" "}
                followers
              </span>
            </div>
            {/* // TODO: Implement feature for artist here later */}
            {isTrackOwner ? null : (
              <Button
                variant={trackDetailArtist?.user[0]?.checkUserFollowing ? "reaction" : "default"}
                className="px-10 py-2 text-sm font-bold"
                onClick={handleFollowUserToggle}
              >
                {trackDetailArtist?.user[0]?.checkUserFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-x-4">
          <Button variant="reaction" className="group text-sm font-bold" onClick={handleFavoriteClick}>
            <HeartIcon
              className={cn(
                `group-hover:text-main-grey group-hover:fill-main-grey inline-block size-4`,
                trackDetail?.checkTrackInFavorite
                  ? "fill-main-purple text-main-purple"
                  : "text-main-white fill-main-white",
              )}
            />
            <span className="text-main-grey">{formatNumber(trackData?.favoriteCount || 0)}</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="reaction" className="group text-sm font-bold">
                <EllipsisIcon className="inline-block size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleCopyLink}>
                  <CopyIcon className="text-main-white mr-2 size-4" />
                  <span className="text-main-white text-base">Copy link</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    executeWithAuth(
                      () => {
                        setAddToPlaylistModalOpen(true);
                      },
                      "playlist",
                      trackDetail?.name,
                    );
                  }}
                >
                  <ListPlusIcon className="text-main-white mr-2 size-4" />
                  <span className="text-main-white text-base">Add to playlist</span>
                </DropdownMenuItem>
                {isAuthenticated && trackDetailArtist?.userId && !isTrackOwner && (
                  <DropdownMenuItem
                    onClick={() => {
                      setReportDialogOpen(true);
                    }}
                  >
                    <FlagIcon className="text-main-white mr-2 size-4" />
                    <span className="text-main-white text-base">Report</span>
                  </DropdownMenuItem>
                )}
                {isTrackOwner && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href={`/artist/studio/tracks/insights/${trackId}`}>
                        <BarChart3Icon className="text-main-white mr-2 size-4" />
                        <span className="text-main-white text-base">Insights</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/artist/studio/tracks/detail/${trackId}`}>
                        <InfoIcon className="text-main-white mr-2 size-4" />
                        <span className="text-main-white text-base">Details</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {trackDetail?.id && isAuthenticated && (
          <>
            <PlaylistAddModal
              open={addToPlaylistModalOpen}
              onOpenChange={setAddToPlaylistModalOpen}
              trackId={trackDetail.id}
            />
            {trackDetailArtist?.userId && !isTrackOwner && (
              <ReportDialog
                contentType={ReportRelatedContentType.Track}
                contentId={trackDetail.id}
                reportedUserId={trackDetailArtist.userId}
                reportedUserName={trackDetail.name}
                open={reportDialogOpen}
                onOpenChange={setReportDialogOpen}
              />
            )}
          </>
        )}

        <WarningAuthDialog
          open={showWarningDialog}
          onOpenChange={setShowWarningDialog}
          action={warningAction}
          trackName={trackName}
        />
      </div>

      {/* Track Description Card */}
      {trackDetail?.description && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className={cn("text-main-white text-sm leading-relaxed", !isDescriptionExpanded && "line-clamp-2")}>
                {trackDetail.description}
              </p>
              {trackDetail.description.length > 100 && (
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-main-purple hover:text-main-purple/80 text-sm font-medium transition-colors"
                >
                  {isDescriptionExpanded ? "Less" : "More"}
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrackOwnerSection;
