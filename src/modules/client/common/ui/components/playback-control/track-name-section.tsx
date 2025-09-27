import Image from "next/image";
import React from "react";
import { useAudioStore } from "@/store";

const TrackNameSection = () => {
  const { currentTrack } = useAudioStore();

  if (!currentTrack) {
    return (
      <div className="flex min-w-60 items-center gap-3">
        <div className="size-8 rounded-sm bg-gray-700" />
        <div className="flex flex-col">
          <span className="truncate text-sm font-semibold text-gray-500">
            No track selected
          </span>
          <span className="truncate text-xs text-gray-400">—</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-60 items-center gap-3">
      <Image
        src={currentTrack.coverImage || "https://placehold.co/32x32"}
        alt={currentTrack.title}
        width={32}
        height={32}
        className="rounded-sm object-cover"
        unoptimized
      />
      <div className="flex flex-col">
        <span className="truncate text-sm font-semibold">
          {currentTrack.title}
        </span>
        <span className="truncate text-xs text-gray-400">
          {currentTrack.artist}
        </span>
      </div>
    </div>
  );
};

export default TrackNameSection;
