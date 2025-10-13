import Image from "next/image";
import React from "react";
import { useAudioStore } from "@/store";

const TrackNameSection = () => {
  const { currentTrack } = useAudioStore();

  if (!currentTrack) {
    return (
      <div className="pointer-events-none flex w-80 items-center gap-3 opacity-50">
        <div className="primary_gradient size-8 rounded-sm" />
        <div className="flex flex-col">
          <span className="truncate text-sm font-semibold text-gray-500">
            Track Name
          </span>
          <span className="truncate text-xs text-gray-400">Artist Name</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-80 items-center gap-3">
      <Image
        src={currentTrack.coverImage || "https://placehold.co/32x32"}
        alt={currentTrack.title}
        width={32}
        height={32}
        className="rounded-sm object-cover"
        unoptimized
      />
      <div className="flex flex-col">
        <span className="line-clamp-1 text-sm font-semibold">
          {currentTrack.title}
        </span>
        <span className="line-clamp-1 text-xs text-gray-400">
          {currentTrack.artist}
        </span>
      </div>
    </div>
  );
};

export default TrackNameSection;
