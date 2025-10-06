import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import TooltipButton from "@/modules/shared/ui/components/tooltip-button";
import { formatMilliseconds } from "@/utils/format-milliseconds";
import { useAudioStore } from "@/store";
import { Repeat, Shuffle, SkipBack, SkipForward } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const PlayerControl = () => {
  const {
    isPlaying,
    currentTime,
    duration,
    isShuffling,
    isRepeating,
    togglePlayPause,
    skipToPrevious,
    skipToNext,
    toggleShuffle,
    toggleRepeat,
    seek,
  } = useAudioStore();

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    seek(newTime);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-1 items-center gap-x-7">
      <TooltipButton content="Shuffle">
        <Button
          variant="ghost"
          size="iconXs"
          className={`text-main-white hover:text-main-grey ${
            isShuffling ? "text-main-purple" : ""
          }`}
          onClick={toggleShuffle}
        >
          <Shuffle className="size-[18px]" />
        </Button>
      </TooltipButton>

      <TooltipButton content="Previous">
        <Button
          variant="ghost"
          size="iconSm"
          className="text-main-white hover:text-main-grey group duration-0"
          onClick={skipToPrevious}
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
            togglePlayPause();
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
          onClick={skipToNext}
        >
          <SkipForward className="fill-main-white group-hover:fill-main-grey size-6 duration-0" />
        </Button>
      </TooltipButton>

      <TooltipButton content="Repeat">
        <Button
          variant="ghost"
          size="iconXs"
          className={`text-main-white hover:text-main-grey ${
            isRepeating ? "text-main-purple" : ""
          }`}
          onClick={toggleRepeat}
        >
          <Repeat className="size-[18px]" />
        </Button>
      </TooltipButton>

      <span className="text-main-white text-xs font-semibold">
        {formatMilliseconds(currentTime)}
      </span>

      <Slider
        className="w-full py-3"
        value={[progressPercentage]}
        onValueChange={handleSeek}
        max={100}
        step={0.1}
      />

      <span className="text-main-white text-xs font-semibold">
        {formatMilliseconds(duration)}
      </span>
    </div>
  );
};

export default PlayerControl;
