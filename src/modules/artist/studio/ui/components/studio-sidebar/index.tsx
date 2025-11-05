"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  // Command,
  AlbumIcon,
  // AudioWaveform,
  AudioLinesIcon,
  // GalleryVerticalEnd,
  LayoutDashboardIcon,
  // Music4Icon,
  LayoutPanelLeftIcon,
  CreditCardIcon,
  BanknoteIcon,
} from "lucide-react";
import React from "react";
import { NavUser } from "../nav-user";
import { NavProjects } from "../nav-projects";
import { TeamSwitcher } from "../team-switcher";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://avatars.githubusercontent.com/u/124599?v=4g",
  },
  team: {
    name: "Ekofy",
    logo: "/ekofy-logo-xs.svg",
    role: "Artist Studio",
  },
  projects: [
    {
      name: "Dashboard",
      url: "/artist/studio",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Tracks",
      url: "/artist/studio/tracks",
      icon: AudioLinesIcon,
    },
    {
      name: "Albums",
      url: "/artist/studio/albums",
      icon: AlbumIcon,
    },
    {
      name: "Service Packages",
      url: "/artist/studio/service-package",
      icon: LayoutPanelLeftIcon,
    },
    {
      name: "Payment History",
      url: "/artist/studio/transactions/payment-history",
      icon: CreditCardIcon,
    },
    {
      name: "Payouts",
      url: "/artist/studio/transactions/payouts",
      icon: BanknoteIcon,
    },
  ],
};

const StudioSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher team={data.team} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default StudioSidebar;
