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
import { ArtistDetailQuery, PopularityActionType, ReportRelatedContentType } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import TooltipButton from "@/modules/shared/ui/components/tooltip-button";
import {
  AlbumIcon,
  AudioLinesIcon,
  CopyIcon,
  Disc3Icon,
  EllipsisIcon,
  FlagIcon,
  ListMusicIcon,
  LucideIcon,
  MailIcon,
  MessageCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { useArtistFollow } from "@/hooks/use-artist-follow";
import { useAuthStore } from "@/store";
import { useAuthAction } from "@/hooks/use-auth-action";
import { WarningAuthDialog } from "@/modules/shared/ui/components/warning-auth-dialog";
import { ReportDialog } from "@/modules/shared/ui/components/report-dialog";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { addConversationGeneralMutationOptions } from "@/gql/options/client-mutation-options";
import { useProcessArtistEngagementPopularity } from "@/gql/client-mutation-options/popularity-mutation-option";

const activeItemStyles = "bg-neutral-800 text-neutral-100 rounded-br-none rounded-bl-none";

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

const ArtistOptionsSection = ({ artistData, artistId }: ArtistOptionsSectionProps) => {
  const router = useRouter();
  const route = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const artist = artistData.artists?.items?.[0];

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
  const { mutateAsync: addConversation } = useMutation(addConversationGeneralMutationOptions);
  const { mutate: artistEngagementPopularity } = useProcessArtistEngagementPopularity();
  const { showWarningDialog, setShowWarningDialog, warningAction, trackName, executeWithAuth } = useAuthAction();
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Copied!");
    artistEngagementPopularity({
      artistId: artistId,
      actionType: PopularityActionType.Share,
    });
  };

  const handleChatWithArtist = async () => {
    const { addConversationGeneral } = await addConversation(artist!.userId!);

    router.push(`/inbox/${addConversationGeneral}?t=NONE`);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4">
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
          <>
            <Button
              variant={artistData.artists?.items?.[0]?.user[0]?.checkUserFollowing ? "reaction" : "default"}
              className="px-10 py-2 text-sm font-bold"
              onClick={() => {
                const user = artistData.artists?.items?.[0]?.user[0];
                const artist = artistData.artists?.items?.[0];
                if (user?.id && artist?.stageName) {
                  executeWithAuth(
                    () => handleFollowToggle(user.id, user.checkUserFollowing ?? false, artist.stageName),
                    "follow",
                  );
                }
              }}
            >
              {artistData.artists?.items?.[0]?.user[0]?.checkUserFollowing ? "Following" : "Follow"}
            </Button>

            <TooltipButton content="Chat with Artist" side="top">
              <Button
                variant="reaction"
                className="text-sm font-bold"
                onClick={() => {
                  executeWithAuth(() => handleChatWithArtist(), "chat");
                }}
              >
                <MessageCircleIcon className={"inline-block size-4"} />
              </Button>
            </TooltipButton>
            <TooltipButton content="Contact Artist" side="top">
              <Link href={`mailto:${artistData.artists?.items?.[0].email}`} target="_blank">
                <Button variant="reaction" className="text-sm font-bold">
                  <MailIcon className={"inline-block size-4"} />
                </Button>
              </Link>
            </TooltipButton>
          </>
        )}

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
              {isAuthenticated && artist?.userId && user?.userId !== artist?.userId && (
                <DropdownMenuItem onClick={() => setReportDialogOpen(true)}>
                  <FlagIcon className="text-main-white mr-2 size-4" />
                  <span className="text-main-white text-base">Report</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <WarningAuthDialog
        open={showWarningDialog}
        onOpenChange={setShowWarningDialog}
        action={warningAction}
        trackName={trackName}
      />

      {/* Report Dialog */}
      {artist?.userId && (
        <ReportDialog
          contentType={ReportRelatedContentType.Artist}
          reportedUserId={artist.userId}
          reportedUserName={artist.stageName}
          open={reportDialogOpen}
          onOpenChange={setReportDialogOpen}
        />
      )}
    </div>
  );
};

export default ArtistOptionsSection;
