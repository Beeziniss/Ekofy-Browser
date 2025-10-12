import { Button } from "@/components/ui/button";
import { PopoverClose } from "@radix-ui/react-popover";
import { useAudioStore } from "@/store";
import { X } from "lucide-react";
import Image from "next/image";
import React from "react";

const PlayerListQueue = () => {
  const { currentTrack, queue, currentIndex, skipToTrack } = useAudioStore();

  const upcomingTracks = queue.slice(currentIndex + 1);

  return (
    <div className="grid gap-y-4 px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Queue</h2>
        <PopoverClose asChild>
          <Button className="bg-main-grey-dark-bg group hover:bg-main-grey-dark-bg/90 size-8 rounded-full">
            <X className="text-main-grey-dark group-hover:text-main-grey size-6" />
          </Button>
        </PopoverClose>
      </div>

      {/* Now Playing Track */}
      {currentTrack && (
        <div className="flex flex-col gap-y-3">
          <h3 className="text-sm font-medium">Now Playing</h3>
          <div className="flex items-center gap-x-3">
            <Image
              src={currentTrack.coverImage || "https://placehold.co/32x32"}
              alt={currentTrack.title}
              width={32}
              height={32}
              className="rounded-[4px] object-cover"
              unoptimized
            />
            <div className="flex flex-col items-start">
              <span className="line-clamp-1 text-sm font-semibold">
                {currentTrack.title}
              </span>
              <span className="text-main-grey text-xs font-medium">
                {currentTrack.artist}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Next Up Track List */}
      {upcomingTracks.length > 0 && (
        <div className="flex flex-col gap-y-3">
          <h3 className="text-sm font-medium">Next Up</h3>
          <div className="flex max-h-60 flex-col gap-y-2 overflow-y-auto">
            {upcomingTracks.map((track, index) => {
              const actualIndex = currentIndex + 1 + index;
              return (
                <button
                  key={`${track.id}-${actualIndex}`}
                  className="hover:bg-main-grey-dark-bg/50 flex items-center gap-x-3 rounded p-2 transition-colors"
                  onClick={() => skipToTrack(actualIndex)}
                >
                  <Image
                    src={track.coverImage || "https://placehold.co/32x32"}
                    alt={track.title}
                    width={32}
                    height={32}
                    className="rounded-[4px] object-cover"
                    unoptimized
                  />
                  <div className="flex flex-col items-start">
                    <span className="line-clamp-1 text-sm font-semibold">
                      {track.title}
                    </span>
                    <span className="text-main-grey line-clamp-1 text-xs font-medium">
                      {track.artist}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!currentTrack && queue.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-main-grey text-sm">No tracks in queue</p>
        </div>
      )}
    </div>
  );
};

export default PlayerListQueue;
