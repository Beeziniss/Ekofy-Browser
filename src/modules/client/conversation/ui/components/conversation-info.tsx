import { useQuery } from "@tanstack/react-query";
import { getUserInitials } from "@/utils/format-shorten-name";
import { userBasicInfoOptions } from "@/gql/options/client-options";
import { ClockFadingIcon, MailIcon, PhoneIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/utils/format-date";
import ConversationInfoRequests from "./conversation-info-requests";
import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";
import { ConversationStatus } from "@/gql/graphql";

interface ConversationInfoProps {
  currentUserId: string;
  otherUserId: string;
  avatarImage: string | undefined;
  nickname?: string;
  isArtist: boolean;
  conversationId?: string;
  conversationStatus?: ConversationStatus;
  requestId?: string | null;
}

const ConversationInfo = memo(
  ({
    currentUserId,
    otherUserId,
    avatarImage,
    nickname,
    isArtist,
    conversationId,
    conversationStatus,
    requestId,
  }: ConversationInfoProps) => {
    const { data: userInfo, isPending } = useQuery(userBasicInfoOptions(otherUserId));

    // Use the key prop to force re-mounting when switching users
    // This prevents the "data flicker" where User A's data shows briefly for User B
    return (
      <div className="flex h-full w-full flex-col space-y-6 overflow-y-auto">
        {/* Requests Section */}
        <ConversationInfoRequests
          key={otherUserId}
          currentUserId={currentUserId}
          otherUserId={otherUserId}
          isArtist={isArtist}
          conversationId={conversationId}
          requestId={requestId}
          conversationStatus={conversationStatus}
        />

        {/* Profile Information Section */}
        {isPending ? (
          <div className="space-y-4">
            <Skeleton className="h-7 w-40 rounded-md" /> {/* Title Skeleton */}
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="size-56 rounded-full" /> {/* Avatar Skeleton */}
              <Skeleton className="h-6 w-32 rounded-md" /> {/* Name Skeleton */}
              <div className="w-full space-y-3">
                <Skeleton className="h-5 w-full rounded-md" />
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-5 w-1/2 rounded-md" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-main-white text-lg font-semibold">Profile Information</h3>

            <div className="flex flex-col items-center space-y-4">
              <Avatar className="size-56">
                <AvatarImage src={avatarImage} alt="User Avatar" />
                <AvatarFallback className="bg-purple-600 text-4xl font-semibold text-white">
                  {getUserInitials(nickname || otherUserId)}
                </AvatarFallback>
              </Avatar>

              <div className="w-full">
                <h4 className="text-main-white font-medium">{nickname || "This is a name"}</h4>
              </div>

              {userInfo && (
                <div className="w-full space-y-3">
                  {userInfo.email && (
                    <div className="text-main-grey flex items-center space-x-3">
                      <MailIcon className="size-5" />
                      <span className="text-sm">{userInfo.email}</span>
                    </div>
                  )}
                  {userInfo.phoneNumber && (
                    <div className="text-main-grey flex items-center space-x-3">
                      <PhoneIcon className="size-5" />
                      <span className="text-sm">{userInfo.phoneNumber}</span>
                    </div>
                  )}
                  {userInfo.createdAt && (
                    <div className="text-main-grey flex items-center space-x-3">
                      <ClockFadingIcon className="size-5" />
                      <span className="text-sm">
                        Joined: <strong>{formatDate(userInfo.createdAt)}</strong>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

ConversationInfo.displayName = "ConversationInfo";

export default ConversationInfo;
