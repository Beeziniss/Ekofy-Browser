import Image from "next/image";
import React from "react";

const TrackNameSection = () => {
  return (
    <div className="flex min-w-60 items-center gap-3">
      <Image
        src={"https://placehold.co/32x32"}
        alt="Track Name"
        width={32}
        height={32}
        className="rounded-sm object-cover"
        unoptimized
      />
      <div className="flex flex-col">
        <span className="truncate text-sm font-semibold">Track Name</span>
        <span className="truncate text-xs text-gray-400">Artist Name</span>
      </div>
    </div>
  );
};

export default TrackNameSection;
