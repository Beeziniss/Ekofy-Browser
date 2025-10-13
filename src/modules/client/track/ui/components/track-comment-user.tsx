import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumber } from "@/utils/format-number";
import { HeartIcon } from "lucide-react";
import React from "react";

const TrackCommentUser = () => {
  return (
    <div className="flex gap-x-3">
      <Avatar className="size-12">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col gap-y-1">
        <div className="flex items-center gap-x-2">
          <span className="text-main-white text-base font-semibold">
            Listener Name
          </span>
          <span className="text-main-grey text-sm">2 months ago</span>
        </div>
        <span className="text-sm">This is a comment and nothing more...</span>
        <div className="flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <HeartIcon className="text-main-white hover:text-main-grey hover:fill-main-grey size-5 hover:cursor-pointer" />
            <span>{formatNumber(1234)}</span>
          </div>

          <span className="text-main-white hover:text-main-grey cursor-pointer">
            Reply
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrackCommentUser;
