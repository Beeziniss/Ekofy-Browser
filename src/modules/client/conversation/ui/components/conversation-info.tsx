import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getUserInitials } from "@/utils/format-shorten-name";
import { orderPackageOptions, userBasicInfoOptions } from "@/gql/options/client-options";
import { ArrowUpRightIcon, ClockFadingIcon, MailIcon, PhoneIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface ConversationInfoProps {
  otherUserId: string;
  avatarImage: string | undefined;
  nickname?: string;
  isArtist?: boolean;
}

const ConversationInfo = ({ otherUserId, avatarImage, nickname, isArtist }: ConversationInfoProps) => {
  const { data: userInfo } = useQuery(userBasicInfoOptions(otherUserId));
  const { data: orderPackage } = useQuery(orderPackageOptions({ userId: otherUserId, skip: 0, take: 1 }));

  const orderPackageData = orderPackage?.packageOrders?.items?.[0];

  return (
    <div className="flex h-full w-full flex-col space-y-6 overflow-y-auto">
      {/* Requests Section */}
      {isArtist && orderPackageData && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-main-white text-lg font-semibold">Orders with you</h3>
            <Link href={`/activities/conversation/${otherUserId}`} passHref>
              <Button variant="link" size="sm" className="h-auto p-0">
                To Order page
              </Button>
            </Link>
          </div>

          <Link href={`/activities/conversation/${otherUserId}`}>
            <div className="bg-main-card-bg hover:bg-main-purple/10 space-y-3 rounded-lg p-2 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="flex size-12 items-center justify-center rounded-md bg-purple-600">
                  <span className="text-sm font-semibold text-white">S</span>
                </div>
                <div className="flex-1">
                  <p className="text-main-white text-sm font-medium">{orderPackageData.package[0].packageName}</p>
                  <p className="text-main-grey text-xs">
                    {Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(orderPackageData.deadline))}
                  </p>
                </div>
                <ArrowUpRightIcon className="text-main-grey size-6" />
              </div>
            </div>
          </Link>
        </div>
      )}

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
                    Joined:{" "}
                    <strong>
                      {new Date(userInfo.createdAt).toLocaleDateString("en-US", {
                        dateStyle: "medium",
                      })}
                    </strong>
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
