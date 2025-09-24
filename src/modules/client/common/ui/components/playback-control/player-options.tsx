import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import TooltipButton from "@/modules/shared/ui/components/tooltip-button";
import { Heart, ListMusic, Volume1, VolumeOff } from "lucide-react";
import React, { useState } from "react";
import PlayerListQueue from "./player-list-queue";

const PlayerOptions = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="flex items-center gap-x-7">
      <TooltipButton content={isLiked ? "Remove from Liked Songs" : "Like"}>
        <Button
          variant="ghost"
          size="iconXs"
          onClick={() => setIsLiked(!isLiked)}
          className="text-main-white hover:text-main-grey"
        >
          <Heart
            className={`size-[18px] ${isLiked ? "fill-main-purple text-main-purple" : ""}`}
          />
        </Button>
      </TooltipButton>

      {/* <TooltipButton content="Now Playing">
        <Button
          variant="ghost"
          size="iconXs"
          className="text-main-white hover:text-main-grey"
        >
          <PlaySquare className="size-[18px]" />
        </Button>
      </TooltipButton> */}

      <Popover>
        <TooltipButton content="Queue">
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="iconXs"
              className="text-main-white hover:text-main-grey"
            >
              <ListMusic className="size-[18px]" />
            </Button>
          </PopoverTrigger>
        </TooltipButton>
        <PopoverContent
          className="bg-main-dark-bg w-[360px] p-0"
          align="end"
          sideOffset={20}
        >
          <PlayerListQueue />
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-x-1">
        <TooltipButton content={isMuted ? "Unmute" : "Mute"}>
          <Button
            variant="ghost"
            size="iconXs"
            className="text-main-white hover:text-main-grey"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <VolumeOff className="size-[18px]" />
            ) : (
              <Volume1 className="size-[18px]" />
            )}
          </Button>
        </TooltipButton>

        <Slider
          className="w-24 py-3"
          defaultValue={[70]}
          value={[isMuted ? 0 : 70]}
        />
      </div>
    </div>
  );
};

export default PlayerOptions;
