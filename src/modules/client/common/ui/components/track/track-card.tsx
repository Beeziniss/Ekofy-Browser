"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Heart, LinkIcon, ListPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const TrackCard = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // TODO: Change this to approriate link
  const onCopy = () => {
    navigator.clipboard.writeText("Hehe");
    toast.info("Link copied to clipboard");
  };

  return (
    <div className="font-bepro max-w-70 rounded-sm">
      <div
        className="group relative size-70 overflow-hidden rounded-sm hover:cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={
            "https://www.onlandscape.co.uk/wp-content/uploads/2012/01/IMG_6347-square-vertorama.jpg"
          }
          alt="Track Name"
          width={280}
          height={280}
          className={`rounded-sm object-cover transition-transform duration-500`}
          unoptimized
        />
        <div
          className={`absolute top-0 left-0 size-full bg-[#00000080] ${isHovered || isMenuOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute top-0 left-0 flex size-full items-center justify-center gap-x-7 ${isHovered || isMenuOpen ? "opacity-100" : "opacity-0"}`}
        >
          <Button
            variant="ghost"
            size="iconMd"
            onClick={() => setIsLiked(!isLiked)}
            className="text-main-white rounded-full duration-0 hover:brightness-90"
          >
            <Heart
              className={`size-6 ${isLiked ? "fill-main-purple text-main-purple" : "text-main-white"}`}
            />
          </Button>

          <Button
            variant="ghost"
            size="iconLg"
            className="text-main-white rounded-full duration-0 hover:brightness-90"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Image
                src={"/pause-button-medium.svg"}
                alt="Ekofy Pause Button"
                width={48}
                height={48}
              />
            ) : (
              <Image
                src={"/play-button-medium.svg"}
                alt="Ekofy Play Button"
                width={48}
                height={48}
              />
            )}
          </Button>

          <DropdownMenu onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="iconMd"
                className="text-main-white rounded-full duration-0 hover:brightness-90"
              >
                <Ellipsis className="text-main-white size-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuItem onClick={onCopy}>
                <LinkIcon className="text-main-white mr-2 size-4" />
                <span className="text-main-white text-sm">Copy link</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ListPlus className="text-main-white mr-2 size-4" />
                <span className="text-main-white text-sm">Add to playlist</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-2 flex flex-col">
        <div className="truncate text-sm font-bold">
          <Link href={"#"} className="hover:text-main-purple">
            Track Name
          </Link>
        </div>

        <div className="text-main-grey truncate text-sm">
          <Link href={"#"} className="hover:text-main-purple hover:underline">
            Artist Name
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
