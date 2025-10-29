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
      <ModeratorSidebar />
      <SidebarInset>
        <header className="!bg-main-dark-bg sticky top-0 z-50 flex h-18 shrink-0 items-center justify-between gap-2 border-b border-white/30 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
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
      
      {/* Global Audio Player for all moderator pages */}
      <ModeratorGlobalAudioPlayer />
    </SidebarProvider>
  );
};

export default ModeratorLayout;
