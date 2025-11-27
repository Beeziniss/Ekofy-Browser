"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import StudioSidebar from "../components/studio-sidebar";
import ArtistStudioHeader from "../components/artist-studio-header";

interface StudioLayoutProps {
  children: React.ReactNode;
}

const StudioLayout = ({ children }: StudioLayoutProps) => {
  return (
    <SidebarProvider>
      <StudioSidebar />
      <SidebarInset>
        <ArtistStudioHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default StudioLayout;
