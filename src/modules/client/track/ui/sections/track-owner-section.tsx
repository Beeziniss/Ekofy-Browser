import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArtistQuery, TrackDetailQuery } from "@/gql/graphql";
import { formatNumber } from "@/utils/format-number";
import {
  CopyIcon,
  EllipsisIcon,
  HeartIcon,
  ListPlusIcon,
  UserIcon,
} from "lucide-react";
import { Suspense, useState } from "react";
import PlaylistAddModal from "@/modules/client/playlist/ui/components/playlist-add-modal";
import { toast } from "sonner";

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

const TrackOwnerSectionSuspense = ({
  data,
  artistData,
}: TrackOwnerSectionProps) => {
  const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);

  const trackId = data.tracks?.items?.[0]?.id;
  const trackData = data.tracks?.items?.[0];

  const handleCopyLink = () => {
    if (trackId) {
      const url = `${window.location.origin}/track/${trackId}`;
      navigator.clipboard.writeText(url);
      toast.success("Copied!");
    }
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-x-3">
        <Avatar className="size-16">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="flex items-center gap-x-6">
          <div className="flex flex-col gap-y-1">
            <span className="text-main-white text-sm font-bold">
              {trackData?.mainArtists?.items?.[0]?.stageName ||
                "Unknown Artist"}
            </span>
            <span className="text-main-grey-dark-1 flex items-center gap-x-1 text-sm">
              <UserIcon className="inline-block size-5" />{" "}
              {trackData?.mainArtists?.items?.[0]?.followerCount || 0} followers
            </span>
          </div>
          {artistData &&
          artistData.artists?.items?.[0]?.userId ===
            trackData?.mainArtists?.items?.[0]?.userId ? null : (
            <Button className="bg-main-white px-10 py-2 text-sm font-bold">
              Follow
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-x-4">
        <Button variant="reaction" className="group text-sm font-bold">
          <HeartIcon className="group-hover:text-main-grey group-hover:fill-main-grey fill-main-purple text-main-purple inline-block size-4" />
          <span className="text-main-grey">
            {formatNumber(trackData?.favoriteCount || 0)}
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="reaction" className="group text-sm font-bold">
              <EllipsisIcon className="inline-block size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="bottom"
            className="w-56"
            // className="bg-main-card-bg border-white/30"
          >
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleCopyLink}>
                <CopyIcon className="text-main-white mr-2 size-4" />
                <span className="text-main-white text-base">Copy link</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAddToPlaylistModalOpen(true)}>
                <ListPlusIcon className="text-main-white mr-2 size-4" />
                <span className="text-main-white text-base">
                  Add to playlist
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {trackId && (
        <PlaylistAddModal
          open={addToPlaylistModalOpen}
          onOpenChange={setAddToPlaylistModalOpen}
          trackId={trackId}
        />
      )}
    </div>
  );
};

export default TrackOwnerSection;
