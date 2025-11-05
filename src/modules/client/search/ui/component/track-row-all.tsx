import React from "react";
import { Button } from "@/components/ui/button";
import { PauseIcon, PlayIcon } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { SearchTrackItem } from "@/types/search";
import { useTrackPlayback } from "@/hooks/use-track-playback";
import { useAudioStore } from "@/store";
import { formatDuration } from "@/utils/duration-utils";
import { useSearchAuth } from '../../hooks/use-search-auth';
import { TrackActionMenu } from "./track-action-menu";

interface TrackRowAllProps {
  track: SearchTrackItem;
  index: number;
}

export const TrackRowAll = ({ track, index }: TrackRowAllProps) => {
  const { duration } = useAudioStore();
  const { executeWithAuth } = useSearchAuth();
  
  const {
    isTrackCurrentlyPlaying,
    isPlaying,
    handlePlayPause,
  } = useTrackPlayback(track.id, {
    id: track.id,
    name: track.name,
    coverImage: track.coverImage,
    mainArtists: track.mainArtists,
  });

  const formatCreatedAt = (createdAt: string) => {
    return new Date(createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePlayPauseClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    executeWithAuth(async () => {
      await handlePlayPause();
    }, "play", track.name);
  };

  // Use real duration if track is currently playing, otherwise fallback
  const displayDuration = isTrackCurrentlyPlaying && duration > 0
    ? formatDuration(duration)
    : formatCreatedAt(track.createdAt);

  return (
    <TableRow className="group relative border-b border-gray-800/50 hover:bg-gray-800/50">
      <TableCell className="w-12 text-center">
        <div className="flex h-8 w-8 items-center justify-center">
          <span className={`text-sm text-gray-400 group-hover:hidden ${isTrackCurrentlyPlaying && isPlaying ? "text-main-purple" : ""}`}>
            {isTrackCurrentlyPlaying && isPlaying ? "♪" : index + 1}
          </span>
          <div className="hidden group-hover:block">
            <Button
              onClick={handlePlayPauseClick}
              className="bg-transparent hover:bg-gray-700 p-0 w-8 h-8 rounded-full"
            >
              {isTrackCurrentlyPlaying && isPlaying ? (
                <PauseIcon className="text-white w-4 h-4" />
              ) : (
                <PlayIcon className="text-white w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center space-x-3">
          <Image
            src={track.coverImage || "/default-track.png"}
            alt={track.name}
            width={40}
            height={40}
            className="h-10 w-10 flex-shrink-0 rounded object-cover"
          />
          <div className="min-w-0">
            <p className={`truncate font-medium ${isTrackCurrentlyPlaying && isPlaying ? "text-main-purple" : "text-white"}`}>
              {track.name}
            </p>
            <p className="truncate text-sm text-gray-400">
              {track.mainArtists?.items?.[0]?.stageName || "Unknown Artist"}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell className="relative text-right">
        <div className="flex items-center justify-end space-x-2">
          <span className="text-sm text-gray-400">{displayDuration}</span>
          <div className="relative z-10 opacity-0 transition-opacity group-hover:opacity-100">
            <TrackActionMenu track={track} isVisible={false} />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};