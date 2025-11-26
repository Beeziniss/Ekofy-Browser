"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { CircleUser, Boxes } from "lucide-react";
import React from "react";
import { NavUser } from "../nav-user";
import { NavProjects } from "../nav-projects";
import { TeamSwitcher } from "../team-switcher";

const data = {
  user: {
    name: "Admin",
    email: "admin@ekofy.com",
    avatar: "https://avatars.githubusercontent.com/u/124599?v=4g",
  },
  team: {
    name: "Ekofy",
    logo: "/ekofy-logo-xs.svg",
    role: "Admin Panel",
  },
  projects: [
    {
      name: "Manage Subscription",
      url: "/admin/subscription",
      icon: Boxes,
    },
    {
      name: "User Management",
      url: "/admin/user-management",
      icon: CircleUser,
    },
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
