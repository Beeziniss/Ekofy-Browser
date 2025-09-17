"use client";

import TrackNameSection from "./track-name-section";
import PlayerControl from "./player-control";
import PlayerOptions from "./player-options";

const PlaybackControl = () => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 w-full">
      <section className="flex h-12 items-center gap-x-7 bg-[#303030] px-3 py-2 text-white">
        <TrackNameSection />
        <PlayerControl />
        <PlayerOptions />
      </section>
    </div>
  );
};

export default PlaybackControl;
