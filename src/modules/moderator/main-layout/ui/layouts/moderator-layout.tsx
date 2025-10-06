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

interface ModeratorLayoutProps {
  children: React.ReactNode;
}

const ModeratorLayout = ({ children }: ModeratorLayoutProps) => {
  return (
    <SidebarProvider>
      <ModeratorSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-white/30 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ModeratorLayout;