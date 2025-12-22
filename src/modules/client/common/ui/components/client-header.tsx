"use client";

import Link from "next/link";
import SearchBar from "./search-bar";
import HeaderNav from "./header-nav";
import AuthButton from "./auth-button";
import { EkofyLogoText } from "@/assets/icons";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store";

interface NavItem {
  href: string;
  label: string;
  activeStyle: string;
  useStartsWith?: boolean;
  requireAuth?: boolean;
}

const navBarItems: NavItem[] = [
  {
    href: "/home",
    label: "Home",
    activeStyle: "border-b-main-white text-main-white",
    useStartsWith: false,
    requireAuth: false,
  },
  {
    href: "/library",
    label: "Library",
    activeStyle: "border-b-main-white text-main-white",
    useStartsWith: false,
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

const ClientHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  const isNavItemActive = (item: NavItem) => {
    if (item.useStartsWith) {
      if (item.href === "/" && pathname !== "/") {
        return false;
      }
      return pathname.startsWith(item.href);
    }
    return pathname === item.href;
  };

  return (
    <div className="bg-main-dark-bg fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-2 md:px-6 md:py-0">
      {/* Mobile: Burger Menu */}
      {/* <div className="flex items-center gap-x-3 md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <MenuIcon className="text-main-white size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-main-dark-bg border-main-grey-1 w-[280px]">
            <SheetHeader>
              <SheetTitle>
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <EkofyLogoText className="w-28" />
                </Link>
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-y-2">
              {navBarItems.map((item) => {
                if (item.requireAuth && !isAuthenticated) return null;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-main-grey-dark-1 hover:bg-main-grey-1 rounded-md px-4 py-3 text-base font-semibold transition-colors",
                      isNavItemActive(item) && "bg-main-grey-1 text-main-white",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/">
          <EkofyLogoText className="w-24 md:w-28 lg:w-32" />
        </Link>
      </div> */}

      <div className="flex items-center gap-x-8">
        {/* LEFT SIDE: Mobile Menu + Logo */}
        <div className="flex items-center gap-x-3">
          {/* Burger Menu (Hidden on Desktop) */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <MenuIcon className="text-main-white size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-main-dark-bg border-main-grey-1 w-[280px]">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <EkofyLogoText className="w-28" />
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-y-2">
                {navBarItems.map((item) => {
                  if (item.requireAuth && !isAuthenticated) return null;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-main-grey-dark-1 hover:bg-main-grey-1 rounded-md px-4 py-3 text-base font-semibold transition-colors",
                        isNavItemActive(item) && "bg-main-grey-1 text-main-white",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Unified Logo: Responsive sizing, always visible */}
          <Link href="/">
            <EkofyLogoText className="w-24 md:w-28 lg:w-32" />
          </Link>
        </div>

        {/* MIDDLE: Desktop Nav + Search (Only visible on LG) */}
        <div className="hidden items-center gap-x-8 lg:flex">
          <HeaderNav />
          <SearchBar />
        </div>
      </div>

      {/* RIGHT SIDE: Auth */}
      <AuthButton />
    </div>
  );
};

export default ClientHeader;
