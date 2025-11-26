"use client";

import { Icon } from "@/components/ui/icon";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store";
import { ArrowLeftIcon, BriefcaseIcon, Disc3Icon, LucideIcon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

const activeItemStyles = "bg-neutral-800 text-neutral-100 rounded-br-none rounded-bl-none";

const OrderNavigationMenu = () => {
  const route = usePathname();
  const { user } = useAuthStore();
  const { orderId } = useParams<{ orderId: string }>();

  const mainNavItems: NavItem[] = [
    {
      title: "Details",
      href: `/orders/${orderId}/details`,
      icon: BriefcaseIcon,
    },
    {
      title: "Submission",
      href: `/orders/${orderId}/submission`,
      icon: Disc3Icon,
    },
  ];

  return (
    <div className="flex items-center justify-between">
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

      <Link
        href={`${user?.artistId ? `/activities/order/${user.userId}` : `/activities/conversation/${user?.userId}`}`}
        className="text-main-white hover:border-main-white flex cursor-pointer items-center gap-x-2 border-b border-transparent pb-0.5 transition-colors"
      >
        <ArrowLeftIcon className="w-4" />
        Back to Order List
      </Link>
    </div>
  );
};

export default OrderNavigationMenu;
