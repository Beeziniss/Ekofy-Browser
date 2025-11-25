import { useQuery } from "@tanstack/react-query";
import { getUserInitials } from "@/utils/format-shorten-name";
import { userBasicInfoOptions } from "@/gql/options/client-options";
import { ClockFadingIcon, MailIcon, PhoneIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/utils/format-date";
import ConversationInfoRequests from "./conversation-info-requests";

interface ConversationInfoProps {
  currentUserId: string;
  otherUserId: string;
  avatarImage: string | undefined;
  nickname?: string;
  isArtist: boolean;
}

const ConversationInfo = ({ currentUserId, otherUserId, avatarImage, nickname, isArtist }: ConversationInfoProps) => {
  const { data: userInfo } = useQuery(userBasicInfoOptions(otherUserId));

  return (
    <div className="flex h-full w-full flex-col space-y-6 overflow-y-auto">
      {/* Requests Section */}
      <ConversationInfoRequests currentUserId={currentUserId} otherUserId={otherUserId} isArtist={isArtist} />

      {/* Profile Information Section */}
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
    </div>
  );
};

export default ConversationInfo;
