import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AudioLines,
  Bell,
  Headset,
  LogOut,
  Rss,
  Settings,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const AuthButton = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);

  return (
    <>
      {isAuthenticated ? (
        // Signed in
        <div className="flex items-center gap-x-4">
          <Button
            variant={"ghost"}
            size={"iconSm"}
            className="text-main-white rounded-full duration-0 hover:brightness-90"
          >
            {hasNotification ? (
              <Image
                src={"/bell-active.svg"}
                alt="Notification Bell Active"
                width={24}
                height={24}
              />
            ) : (
              <Bell className="size-6" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-10 cursor-pointer">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>E</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="text-main-white mr-2 size-4" />
                  <span className="text-main-white text-base">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <AudioLines className="text-main-white mr-2 size-4" />
                  <span className="text-main-white text-base">Track</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Image
                    src={"/sparkles-colorful.svg"}
                    alt="Sparkles Colorful Icon"
                    width={16}
                    height={16}
                    className="mr-2"
                  />
                  <span className="primary_gradient !bg-gradient-to-b bg-clip-text text-base font-semibold text-transparent">
                    Go Premium
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Rss className="text-main-white mr-2 size-4" />
                  <span className="text-main-white text-base">Blog</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Headset className="text-main-white mr-2 size-4" />
                  <span className="text-main-white text-base">Support</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Settings className="text-main-white mr-2 size-4" />
                  <span className="text-main-white text-base">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 size-4 text-red-500" />
                  <span className="text-main-white text-base">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        // Signed out
        <div className="flex items-center gap-x-4">
          <Link href={"/"} className="hover:underline">
            <span className="text-sm font-medium">Sign In</span>
          </Link>
          <Link href={"/"}>
            <Button className="primary_gradient font-semibold text-white hover:brightness-90">
              Create Account
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default AuthButton;
