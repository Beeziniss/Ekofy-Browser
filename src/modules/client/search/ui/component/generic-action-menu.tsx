"use client";

import React from "react";
import { Plus, Heart, Share, Flag, Eye, MoreHorizontal } from "lucide-react";
import { SearchArtistItem, SearchPlaylistItem } from "@/types/search";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface GenericActionMenuProps {
  item: SearchArtistItem | SearchPlaylistItem;
  type: "artist" | "playlist" | "album";
  className?: string;
}

export const GenericActionMenu: React.FC<GenericActionMenuProps> = ({ item, type, className = "" }) => {
  const router = useRouter();

  const getMenuItems = () => {
    const commonItems = [
      {
        icon: Share,
        label: "Share",
        action: () => console.log(`Share ${type}`, item),
      },
      {
        icon: Flag,
        label: "Report",
        action: () => console.log(`Report ${type}`, item),
      },
    ];

    switch (type) {
      case "artist":
        return [
          {
            icon: Plus,
            label: "Follow",
            action: () => console.log("Follow artist", item),
          },
          ...commonItems,
        ];

      case "playlist":
        return [
          {
            icon: Heart,
            label: "Like",
            action: () => console.log("Like playlist", item),
          },
          {
            icon: Plus,
            label: "Add to Your Library",
            action: () => console.log("Add playlist to library", item),
          },
          {
            icon: Eye,
            label: "View Details",
            action: () => {
              router.push(`/playlists/${item.id}`);
            },
          },
          ...commonItems,
        ];

      case "album":
        return [
          {
            icon: Heart,
            label: "Save to Your Library",
            action: () => console.log("Save album", item),
          },
          ...commonItems,
        ];

      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className={`relative ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <MoreHorizontal className="h-5 w-5 text-gray-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {menuItems.map((menuItem, index) => (
            <DropdownMenuItem key={index} onClick={menuItem.action}>
              <menuItem.icon className="mr-2 h-4 w-4" />
              <span>{menuItem.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
