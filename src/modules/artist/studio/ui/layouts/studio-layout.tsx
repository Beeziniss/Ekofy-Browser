import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import StudioSidebar from "../components/studio-sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CloudUploadIcon, MessageCircle } from "lucide-react";
import Link from "next/link";

interface StudioLayoutProps {
  children: React.ReactNode;
}

const StudioLayout = ({ children }: StudioLayoutProps) => {
  return (
    <SidebarProvider>
      <StudioSidebar />
      <SidebarInset>
        <header className="!bg-main-dark-bg sticky top-0 z-50 flex h-18 items-center justify-between gap-2 border-b border-white/30 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          </div>

          <div className="flex items-center gap-x-2">
            <Link href={"/artist/track-upload"}>
              <Button variant="outline" size={"lg"}>
                <CloudUploadIcon className="size-5" /> Upload
              </Button>
            </Link>

            <Button variant="ghost" size="iconXs">
              <MessageCircle className="size-4" />
            </Button>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default StudioLayout;
