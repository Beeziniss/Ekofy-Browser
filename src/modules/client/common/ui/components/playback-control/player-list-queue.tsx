import { Button } from "@/components/ui/button";
import { PopoverClose } from "@radix-ui/react-popover";
import { X } from "lucide-react";
import React from "react";

const PlayerListQueue = () => {
  return (
    <div className="grid gap-y-4 px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Queue</h2>
        <PopoverClose asChild>
          <Button
            className="bg-main-grey-dark-bg group hover:bg-main-grey-dark-bg/90 size-8 rounded-full"
            // onClick={onClose}
          >
            <X className="text-main-grey-dark group-hover:text-main-grey size-6" />
          </Button>
        </PopoverClose>
      </div>

      {/* Now Playing Track List */}
      <div className="flex flex-col gap-y-3">
        <h3 className="text-sm font-medium">Now Playing</h3>

        {/* Track List */}
        <div className="flex items-center gap-x-3">
          <div className="primary_gradient size-8 rounded-[4px]" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold">Track Title</span>
            <span className="text-main-grey text-xs font-medium">
              Artist Name
            </span>
          </div>
        </div>
      </div>

      {/* Next Up Track List */}
      <div className="flex flex-col gap-y-3">
        <h3 className="text-sm font-medium">Next Up</h3>

        {/* Track List */}
        <div className="flex items-center gap-x-3">
          <div className="primary_gradient size-8 rounded-[4px]" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold">Track Title</span>
            <span className="text-main-grey text-xs font-medium">
              Artist Name
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerListQueue;
