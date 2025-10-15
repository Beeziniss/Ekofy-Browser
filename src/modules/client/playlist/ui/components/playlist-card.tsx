import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

interface PlaylistCardProps {
  playlist: {
    __typename?: "Playlist" | undefined;
    id: string;
    name: string;
    coverImage?: string | null | undefined;
    isPublic: boolean;
  };
}

const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onCopy = (e: React.MouseEvent) => {
    e.stopPropagation();

    navigator.clipboard.writeText(
      `${window.location.origin}/playlists/${playlist.id}`,
    );
    toast.success("Copied!");
  };

  return (
    <div key={playlist.id} className="space-y-2.5">
      <Link
        href={`/playlists/${playlist.id}`}
        className={`group relative flex size-70 cursor-pointer items-center justify-center rounded-md transition-opacity after:absolute after:inset-0 after:rounded-md after:bg-black after:content-[''] hover:after:opacity-20 ${isMenuOpen ? "after:opacity-20" : "after:opacity-0"}`}
      >
        <Image
          src={playlist.coverImage || "https://placehold.co/280"}
          alt={playlist.name}
          className="size-70 rounded-md object-cover"
          width={280}
          height={280}
          unoptimized
        />

        {playlist.isPublic && (
          <DropdownMenu onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                className={`bg-main-white hover:bg-main-white absolute bottom-2 left-2 z-10 flex size-12 items-center justify-center rounded-full transition-opacity group-hover:opacity-100 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
              >
                <EllipsisIcon className="text-main-dark-bg hover:text-main-purple size-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start" className="w-48">
              <DropdownMenuItem onClick={onCopy}>
                <LinkIcon className="text-main-white mr-2 size-4" />
                <span className="text-main-white text-sm">Copy link</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </Link>

      <Link
        href={`/playlists/${playlist.id}`}
        className="text-main-white hover:text-main-purple cursor-pointer text-sm hover:underline"
      >
        {playlist.name}
      </Link>

      <p className="text-main-grey text-xs">
        {playlist.isPublic ? "Public" : "Private"}
      </p>
    </div>
  );
};

export default PlaylistCard;
