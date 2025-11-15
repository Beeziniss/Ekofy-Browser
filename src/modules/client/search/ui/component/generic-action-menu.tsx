"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Plus, Heart, Share, Flag, Eye } from "lucide-react";
import { SearchArtistItem, SearchPlaylistItem } from "@/types/search";
import { useRouter } from "next/navigation";

interface GenericActionMenuProps {
  item: SearchArtistItem | SearchPlaylistItem;
  type: "artist" | "playlist" | "album";
  className?: string;
}

export const GenericActionMenu: React.FC<GenericActionMenuProps> = ({ item, type, className = "" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<"right" | "left">("right");
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (isMenuOpen) {
        checkMenuPosition();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMenuOpen) {
      // Calculate position before opening
      setTimeout(() => {
        checkMenuPosition();
      }, 0);
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const checkMenuPosition = () => {
    if (menuRef.current) {
      const buttonRect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const menuWidth = 200;

      if (buttonRect.right + menuWidth > viewportWidth - 20) {
        setMenuPosition("left");
      } else {
        setMenuPosition("right");
      }
    }
  };

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
              setIsMenuOpen(false);
            },
          },
          {
            icon: Eye,
            label: "View Details",
            action: () => {
              router.push(`/playlists/${item.id}`);
              setIsMenuOpen(false);
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
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Three dots button */}
      <button
        onClick={handleMenuToggle}
        className={`rounded-full p-2 transition-all duration-200 group-hover:opacity-100 hover:bg-gray-700 ${
          isMenuOpen ? "bg-gray-700 opacity-100" : "opacity-0"
        }`}
      >
        <MoreHorizontal className="h-5 w-5 text-gray-400" />
      </button>

      {/* Context menu */}
      {isMenuOpen && (
        <div
          className={`absolute top-10 z-[60] min-w-[200px] rounded-lg border border-gray-700 bg-gray-800 py-2 shadow-xl ${
            menuPosition === "right" ? "right-0" : "left-0"
          }`}
        >
          {menuItems.map((menuItem, index) => (
            <button
              key={index}
              onClick={() => {
                menuItem.action();
                setIsMenuOpen(false);
              }}
              className="flex w-full items-center space-x-3 px-4 py-2.5 text-sm text-white transition-colors hover:bg-gray-700"
            >
              <menuItem.icon className="h-4 w-4" />
              <span>{menuItem.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
