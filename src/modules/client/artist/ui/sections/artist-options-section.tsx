import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ArtistDetailQuery } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import TooltipButton from "@/modules/shared/ui/components/tooltip-button";
import {
  AlbumIcon,
  AudioLinesIcon,
  CopyIcon,
  Disc3Icon,
  EllipsisIcon,
  ListMusicIcon,
  LucideIcon,
  MailIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useArtistFollow } from "@/hooks/use-artist-follow";
import { useAuthStore } from "@/store";

const activeItemStyles =
  "bg-neutral-800 text-neutral-100 rounded-br-none rounded-bl-none";

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

interface ArtistOptionsSectionProps {
  artistData: ArtistDetailQuery;
  artistId: string;
}

const ArtistOptionsSection = ({
  artistData,
  artistId,
}: ArtistOptionsSectionProps) => {
  const route = usePathname();
  const { user } = useAuthStore();

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Copied!");
  };

  const mainNavItems: NavItem[] = [
    {
      title: "Tracks",
      href: `/artists/${artistId}/tracks`,
      icon: AudioLinesIcon,
    },
    {
      title: "Albums",
      href: `/artists/${artistId}/albums`,
      icon: AlbumIcon,
    },
    {
      title: "Playlists",
      href: `/artists/${artistId}/playlists`,
      icon: ListMusicIcon,
    },
    {
      title: "Services",
      href: `/artists/${artistId}/services`,
      icon: Disc3Icon,
    },
  ];

  const { handleFollowToggle } = useArtistFollow({
    artistId,
  });

  return (
    <div className="flex items-center justify-between px-6 py-4">
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

      <div className="flex items-center gap-x-3">
        {user && user.artistId && user.artistId === artistId ? (
          <Link href={"/artist/studio/profile"}>
            <Button variant={"ekofy"}>View my profile</Button>
          </Link>
        ) : (
          <Button
            variant={
              artistData.artists?.items?.[0]?.user[0]?.checkUserFollowing
                ? "reaction"
                : "default"
            }
            className="px-10 py-2 text-sm font-bold"
            onClick={() => {
              const user = artistData.artists?.items?.[0]?.user[0];
              const artist = artistData.artists?.items?.[0];
              if (user?.id && artist?.stageName) {
                handleFollowToggle(
                  user.id,
                  user.checkUserFollowing ?? false,
                  artist.stageName,
                );
              }
            }}
          >
            {artistData.artists?.items?.[0]?.user[0]?.checkUserFollowing
              ? "Following"
              : "Follow"}
          </Button>
        )}
        <TooltipButton content="Contact Artist" side="top">
          <Link
            href={`mailto:${artistData.artists?.items?.[0].email}`}
            target="_blank"
          >
            <Button variant="reaction" className="text-sm font-bold">
              <MailIcon className={"inline-block size-4"} />
            </Button>
          </Link>
        </TooltipButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="reaction" className="group text-sm font-bold">
              <EllipsisIcon className="inline-block size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleCopyLink}>
                <CopyIcon className="text-main-white mr-2 size-4" />
                <span className="text-main-white text-base">Copy link</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ArtistOptionsSection;
