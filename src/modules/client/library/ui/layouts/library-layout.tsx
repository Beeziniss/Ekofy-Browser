"use client";

import { Icon } from "@/components/ui/icon";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  AlbumIcon,
  HeartIcon,
  LibrarySquareIcon,
  LucideIcon,
  MicVocalIcon,
  RssIcon,
  UserRoundCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LibraryLayoutProps {
  children: React.ReactNode;
}

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

const mainNavItems: NavItem[] = [
  {
    title: "Playlist",
    href: "/library",
    icon: LibrarySquareIcon,
  },
  {
    title: "Favorites",
    href: "/library/favorites",
    icon: HeartIcon,
  },
  {
    title: "Albums",
    href: "/library/albums",
    icon: AlbumIcon,
  },
  {
    title: "Artists",
    href: "/library/artists",
    icon: MicVocalIcon,
  },
  {
    title: "Following",
    href: "/library/following",
    icon: RssIcon,
  },
  {
    title: "Followers",
    href: "/library/followers",
    icon: UserRoundCheckIcon,
  },
];

const activeItemStyles =
  "bg-neutral-800 text-neutral-100 rounded-br-none rounded-bl-none";

const LibraryLayout = ({ children }: LibraryLayoutProps) => {
  const route = usePathname();

  return (
    <div className="w-full px-6 pt-6">
      {/* Title */}
      <h1 className="text-5xl font-bold">Library</h1>
      <p className="text-main-grey mt-7 text-base">
        {0} followers | {0} following
      </p>

      {/* Tabs Management */}
      <div className="mt-6 space-y-6">
        <NavigationMenu className="flex h-full items-stretch">
          <NavigationMenuList className="flex h-full items-stretch space-x-2">
            {mainNavItems.map((item, index) => (
              <NavigationMenuItem
                key={index}
                className="relative flex h-full items-center"
              >
                <Link
                  href={item.href}
                  className={cn(
                    navigationMenuTriggerStyle(),
                    route === item.href && activeItemStyles,
                    "h-full cursor-pointer px-3 text-xl",
                  )}
                >
                  {item.icon && (
                    <Icon iconNode={item.icon} className="mr-2 size-6" />
                  )}
                  {item.title}
                </Link>
                {route === item.href && (
                  <div className="bg-main-purple absolute bottom-0 left-0 h-0.5 w-full translate-y-px"></div>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default LibraryLayout;
