import Link from "next/link";
import React from "react";

const TrackLikeSection = () => {
  return (
    <div className="w-full space-y-4">
      <div className="flex w-full items-center justify-between">
        <span className="text-main-white text-sm font-bold uppercase">Likes</span>
        <Link href={"#"} className="text-primary-500 text-main-grey-dark-1 text-sm font-bold hover:underline">
          View all
        </Link>
      </div>

      <div className="grid w-full grid-cols-6 gap-y-3 xl:gap-x-8">
        {[...Array(12)].map((_, index) => (
          <div className="flex flex-col items-center gap-y-1" key={index}>
            <div className="primary_gradient h-12 w-12 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackLikeSection;
