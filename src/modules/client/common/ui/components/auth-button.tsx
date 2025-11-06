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
import { AudioLines, Bell, Headset, LogOut, Rss, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store";
import { authApi } from "@/services/auth-services";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserRole } from "@/types/role";
import { useRouter } from "next/navigation";
import { SparklesColorful } from "@/assets/icons";

const AuthButton = () => {
  const { isAuthenticated, user, clearUserData } = useAuthStore();
  const [hasNotification] = useState(false);
  const router = useRouter();

  // Logout mutation
  const { mutate: logout } = useMutation({
    mutationFn: authApi.general.logout,
    onSuccess: () => {
      clearUserData();
      router.replace("/");
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Still clear local data even if server logout fails
      clearUserData();
    },
  });

  // TODO: Might use later
  // Get current profile query - only runs when authenticated
  useQuery({
    queryKey: ["currentProfile"],
    queryFn: authApi.general.getCurrentProfile,
    enabled: isAuthenticated && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleLogout = () => {
    logout();
  };

  const profileLinks: { label: string; href: string }[] = [];
  if (isAuthenticated && user) {
    switch (user.role) {
      case UserRole.LISTENER:
        profileLinks.push({ label: "Profile", href: "/profile" });
        break;
      case UserRole.ARTIST:
        profileLinks.push({
          label: "Artist Profile",
          href: "/artist/studio/profile",
        });
        break;
      case UserRole.MODERATOR:
        profileLinks.push({
          label: "Moderator Profile",
          href: "/moderator/profile",
        });
        break;
      case UserRole.ADMIN:
        profileLinks.push({ label: "Admin Profile", href: "/admin/profile" });
        break;
      default:
        profileLinks.push({ label: "Profile", href: "/profile" });
    }
  }

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
              <Image src={"/bell-active.svg"} alt="Notification Bell Active" width={24} height={24} />
            ) : (
              <Bell className="size-6" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-10 cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>E</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuGroup>
                {profileLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href} className="flex items-center">
                      <User className="text-main-white mr-2 size-4" />
                      <span className="text-main-white text-base">{link.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem>
                  <AudioLines className="text-main-white mr-2 size-4" />
                  <span className="text-main-white text-base">Track</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SparklesColorful className="mr-2 size-4" />
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
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 size-4 text-red-500" />
                  <span className="text-main-white text-base">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        // Signed out
        <div className="flex items-center gap-x-4">
          <Link href={"/login"} className="hover:underline">
            <span className="text-sm font-medium">Sign In</span>
          </Link>
          <Link href={"/sign-up"}>
            <Button className="primary_gradient font-semibold text-white hover:brightness-90">Create Account</Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default AuthButton;
