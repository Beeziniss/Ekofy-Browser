import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";
import ModeratorSidebar from "../components/moderator-sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { ModeratorGlobalAudioPlayer } from "@/modules/moderator/track-approval/ui/components";

interface ModeratorLayoutProps {
  children: React.ReactNode;
}

const ModeratorLayout = ({ children }: ModeratorLayoutProps) => {
  return (
    <SidebarProvider>
      {/* Global Audio Player for all moderator pages */}
      <ModeratorGlobalAudioPlayer />
      
      <ModeratorSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-white/30 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 !bg-main-dark-bg z-50">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>

          <Button variant="ghost" size="iconXs">
            <MessageCircle className="size-4" />
          </Button>
        </header>
        <div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ModeratorLayout;