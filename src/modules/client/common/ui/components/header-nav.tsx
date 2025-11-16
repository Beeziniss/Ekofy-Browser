"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store";
import Link from "next/link";

interface ClientNavbarProps {
  href: string;
  label: string;
  activeStyle: string;
  useStartsWith?: boolean; // Add this flag to determine matching strategy
  requireAuth?: boolean;
}

const navBarItems: ClientNavbarProps[] = [
  {
    href: "/",
    label: "Home",
    activeStyle: "border-b-main-white text-main-white",
    useStartsWith: false,
    requireAuth: false,
  },
  {
    href: "/library",
    label: "Library",
    activeStyle: "border-b-main-white text-main-white",
    useStartsWith: true,
    requireAuth: false,
  },
  {
    href: "/subscription",
    label: "Plans",
    activeStyle: "border-b-main-white text-main-white",
    useStartsWith: false,
  },
  {
    href: "/request-hub",
    label: "Request Hub",
    activeStyle: "border-b-main-white text-main-white",
    useStartsWith: false,
    requireAuth: false,
  },
  {
    href: "/artists-for-hire",
    label: "Artists for Hire",
    activeStyle: "border-b-main-white text-main-white",
    useStartsWith: false,
    requireAuth: false,
  },
];

const HeaderNav = () => {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  // Helper function to determine if a nav item is active
  const isNavItemActive = (item: ClientNavbarProps) => {
    if (item.useStartsWith) {
      // Special case for home route to avoid matching everything
      if (item.href === "/" && pathname !== "/") {
        return false;
      }
      return pathname.startsWith(item.href);
    }
    return pathname === item.href;
  };

  return (
    <div className="flex items-center gap-x-6">
      {navBarItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            `text-main-grey-dark-1 hover:text-main-white inline-block border-b-2 py-[19px]`,
            isNavItemActive(item) ? item.activeStyle : "border-b-transparent",
            item.requireAuth && !isAuthenticated ? "hidden" : "",
          )}
        >
          <span className="text-sm font-semibold">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default HeaderNav;
