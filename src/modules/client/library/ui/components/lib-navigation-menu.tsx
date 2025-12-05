import { Icon } from "@/components/ui/icon";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { AlbumIcon, HeartIcon, LibrarySquareIcon, LucideIcon, RssIcon, UserRoundCheckIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

const activeItemStyles = "bg-neutral-800 text-neutral-100 rounded-br-none rounded-bl-none";

const LibNavigationMenu = () => {
  const route = usePathname();

  return (
    <NavigationMenu className="flex h-full items-stretch">
      <NavigationMenuList className="flex h-full items-stretch space-x-2">
        {mainNavItems.map((item, index) => (
          <NavigationMenuItem key={index} className="relative flex h-full items-center">
            <Link
              href={item.href}
              className={cn(
                navigationMenuTriggerStyle(),
                route === item.href && activeItemStyles,
                "h-full cursor-pointer px-3 text-xl",
              )}
            >
              {item.icon && <Icon iconNode={item.icon} className="mr-2 size-6" />}
              {item.title}
            </Link>
            {route === item.href && (
              <div className="bg-main-purple absolute bottom-0 left-0 h-0.5 w-full translate-y-px" />
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default LibNavigationMenu;
