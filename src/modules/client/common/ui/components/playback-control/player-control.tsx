import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import TooltipButton from "@/modules/shared/ui/components/tooltip-button";
import { formatMilliseconds } from "@/utils/format-milliseconds";
import { Repeat, Shuffle, SkipBack, SkipForward } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const PlayerControl = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeCurrent, setTimeCurrent] = useState(3000);
  const [timeTotal, setTimeTotal] = useState(67000);

  return (
    <div className="flex flex-1 items-center gap-x-7">
      <TooltipButton content="Shuffle">
        <Button
          variant="ghost"
          size="iconXs"
          className="text-main-white hover:text-main-grey"
        >
          <Shuffle className="size-[18px]" />
        </Button>
      </TooltipButton>

      <TooltipButton content="Previous">
        <Button
          variant="ghost"
          size="iconSm"
          className="text-main-white hover:text-main-grey group duration-0"
        >
          <SkipBack className="fill-main-white group-hover:fill-main-grey size-6 duration-0" />
        </Button>
      </TooltipButton>

      <TooltipButton content={isPlaying ? "Pause" : "Play"}>
        <Button
          variant="ghost"
          size="iconMd"
          className="text-main-white duration-0 hover:brightness-90"
          onClick={() => {
            setIsPlaying(!isPlaying);
            toast.success(isPlaying ? "Paused" : "Playing");
          }}
        >
          {isPlaying ? (
            <Image
              src={"/pause-button.svg"}
              alt="Ekofy Pause Button"
              width={32}
              height={32}
            />
          ) : (
            <Image
              src={"/play-button.svg"}
              alt="Ekofy Play Button"
              width={32}
              height={32}
            />
          )}
        </Button>
      </TooltipButton>

      <TooltipButton content="Next">
        <Button
          variant="ghost"
          size="iconSm"
          className="text-main-white hover:text-main-grey group duration-0"
        >
          <SkipForward className="fill-main-white group-hover:fill-main-grey size-6 duration-0" />
        </Button>
      </TooltipButton>

      <TooltipButton content="Repeat">
        <Button
          variant="ghost"
          size="iconXs"
          className="text-main-white hover:text-main-grey"
        >
          <Repeat className="size-[18px]" />
        </Button>
      </TooltipButton>

      <span className="text-main-white text-xs font-semibold">
        {formatMilliseconds(timeCurrent)}
      </span>

      <Slider className="w-full py-3" defaultValue={[30]} />

      <span className="text-main-white text-xs font-semibold">
        {formatMilliseconds(timeTotal)}
      </span>
    </div>
  );
};

export default PlayerControl;
