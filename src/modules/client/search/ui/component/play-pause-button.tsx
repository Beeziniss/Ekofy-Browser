import React from "react";
import Image from "next/image";

interface PlayPauseButtonProps {
  isPlaying: boolean;
  onClick: () => void;
  size?: "small" | "medium" | "large";
  className?: string;
}

export const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({
  isPlaying,
  onClick,
  size = "medium",
  className = "",
}) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`${sizeClasses[size]} transition-transform hover:scale-105 ${className}`}
    >
      <Image
        src={isPlaying ? "/pause-button-medium.svg" : "/play-button-medium.svg"}
        alt={isPlaying ? "Pause" : "Play"}
        width={48}
        height={48}
        className="h-full w-full"
      />
    </button>
  );
};
