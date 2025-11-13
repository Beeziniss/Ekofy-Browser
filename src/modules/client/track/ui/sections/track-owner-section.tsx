import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArtistQuery, TrackDetailQuery, ReportRelatedContentType } from "@/gql/graphql";
import { formatNumber } from "@/utils/format-number";
import { CopyIcon, EllipsisIcon, FlagIcon, HeartIcon, ListPlusIcon, UserIcon } from "lucide-react";
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

interface TrackOwnerSectionProps {
  data: TrackDetailQuery;
  artistData?: ArtistQuery;
}

const TrackOwnerSection = ({ data, artistData }: TrackOwnerSectionProps) => {
  return (
    <Suspense fallback={<TrackOwnerSectionSkeleton />}>
      <TrackOwnerSectionSuspense data={data} artistData={artistData} />
    </Suspense>
  );
};

const TrackOwnerSectionSkeleton = () => {
  return <div>Loading...</div>;
};

const TrackOwnerSectionSuspense = ({ data, artistData }: TrackOwnerSectionProps) => {
  const trackDetail = data.tracks?.items?.[0];
  const trackDetailArtist = trackDetail?.mainArtists?.items?.[0];
  const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const { showWarningDialog, setShowWarningDialog, warningAction, trackName, executeWithAuth, isAuthenticated } =
    useAuthAction();

  const { handleFavorite } = useFavoriteTrack();

  const { handleFollowToggle } = useArtistFollow({
    artistId: trackDetailArtist?.id,
    trackId: trackDetail?.id,
  });

  const trackData = data.tracks?.items?.[0];

  const handleCopyLink = () => {
    if (trackDetail?.id) {
      const url = `${window.location.origin}/track/${trackDetail.id}`;
      navigator.clipboard.writeText(url);
      toast.success("Copied!");
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
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-x-3">
        <Link href={`/artists/${trackData?.mainArtistIds?.[0]}`}>
          <Avatar className="size-16">
            <AvatarImage src={trackDetail?.mainArtists?.items?.[0].avatarImage || "https://github.com/shadcn.png"} />
            <AvatarFallback>{getUserInitials(trackDetail?.mainArtists?.items?.[0]?.stageName || "")}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex items-center gap-x-6">
          <div className="flex flex-col gap-y-1">
            <Link
              href={`/artists/${trackData?.mainArtistIds?.[0]}`}
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
          {artistData && artistData.artists?.items?.[0]?.userId === trackDetailArtist?.userId ? null : (
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
              {isAuthenticated && trackDetailArtist?.userId && (
                <DropdownMenuItem
                  onClick={() => {
                    setReportDialogOpen(true);
                  }}
                >
                  <FlagIcon className="text-main-white mr-2 size-4" />
                  <span className="text-main-white text-base">Report</span>
                </DropdownMenuItem>
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
          {trackDetailArtist?.userId && (
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
  );
};

export default TrackOwnerSection;
