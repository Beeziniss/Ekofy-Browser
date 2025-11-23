import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getUserInitials } from "@/utils/format-shorten-name";
import { userBasicInfoOptions } from "@/gql/options/client-options";
import { ArrowUpRightIcon, MailIcon, PhoneIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConversationInfoProps {
  otherUserId: string;
  avatarImage: string | undefined;
  nickname?: string;
}

const ConversationInfo = ({ otherUserId, avatarImage, nickname }: ConversationInfoProps) => {
  const { data: userInfo } = useQuery(userBasicInfoOptions(otherUserId));

  return (
    <div className="flex h-full w-full flex-col space-y-6 overflow-y-auto">
      {/* Requests Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-main-white text-lg font-semibold">Orders with you</h3>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-blue-400"
            onClick={() => console.log("Navigate to orders")}
          >
            To Request page
          </Button>
        </div>

        <div className="bg-main-card-bg space-y-3 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-purple-600">
              <span className="text-sm font-semibold text-white">S</span>
            </div>
            <div className="flex-1">
              <p className="text-main-white text-sm font-medium">Service name...</p>
              <p className="text-main-grey text-xs">Due date: Jan 01, 2025</p>
            </div>
            <ArrowUpRightIcon className="text-main-grey size-4" />
          </div>
        </div>
      </div>

      {/* Profile Information Section */}
      <div className="space-y-4">
        <h3 className="text-main-white text-lg font-semibold">Profile Information</h3>

        <div className="flex flex-col items-center space-y-4">
          <Avatar className="size-30">
            <AvatarImage src={avatarImage} alt="User Avatar" />
            <AvatarFallback className="bg-purple-600 text-xl text-white">
              {getUserInitials(nickname || otherUserId)}
            </AvatarFallback>
          </Avatar>

          <div className="w-full">
            <h4 className="text-main-white font-medium">{nickname || "This is a name"}</h4>
          </div>

          {userInfo && (
            <div className="w-full space-y-2">
              {userInfo.email && (
                <div className="text-main-grey flex items-center space-x-3">
                  <MailIcon className="h-4 w-4" />
                  <span className="text-sm">{userInfo.email}</span>
                </div>
              )}
              {userInfo.phoneNumber && (
                <div className="text-main-grey flex items-center space-x-3">
                  <PhoneIcon className="h-4 w-4" />
                  <span className="text-sm">{userInfo.phoneNumber}</span>
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
