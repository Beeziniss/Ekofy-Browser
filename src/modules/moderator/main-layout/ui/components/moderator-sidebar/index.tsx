"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  ShieldCheck,
  Flag,
  // UserCheck,
  UserRoundCheck,
  // Settings,
  // LayoutPanelLeft,
  AudioLines,
  PackageCheck,
} from "lucide-react";
import React from "react";
import { NavUser } from "../nav-user";
import { NavProjects } from "../nav-projects";
import { TeamSwitcher } from "../team-switcher";

const data = {
  user: {
    name: "Moderator",
    email: "moderator@ekofy.com",
    avatar: "https://avatars.githubusercontent.com/u/124599?v=4g",
  },
  team: {
    name: "Ekofy",
    logo: "/ekofy-logo-xs.svg",
    role: "Moderator Panel",
  },
  projects: [
    {
      name: "Track Approval",
      url: "/moderator/track-approval",
      icon: AudioLines,
    },
    {
      name: "Report Control",
      url: "/moderator/report-control",
      icon: Flag,
    },
    {
      name: "Artist Approval",
      url: "/moderator/artist-approval",
      icon: UserRoundCheck,
    },
    {
      name: "User Management",
      url: "/moderator/user-management",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Approval Histories",
      url: "/moderator/approval-histories",
      icon: ShieldCheck,
    },
    {
      name: "Public Requests",
      url: "/moderator/public-request",
      icon: PackageCheck,
    },
    {
      name: "Disputed Orders",
      url: "/moderator/disputed-orders",
      icon: PackageCheck,
    },
    // {
    //   name: "Approval Service Packages",
    //   url: "/moderator/approval-service-packages",
    //   icon: PackageCheck,
    // },
  ],
};

const ModeratorSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
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

export default ModeratorSidebar;
