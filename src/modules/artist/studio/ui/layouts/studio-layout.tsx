"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React, { useState } from "react";
import StudioSidebar from "../components/studio-sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CloudUploadIcon, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useStripeAccountStatus } from "@/hooks/use-stripe-account-status";
import { StripeAccountRequiredModal } from "@/modules/shared/ui/components/stripe-account-required-modal";

interface StudioLayoutProps {
  children: React.ReactNode;
}

const StudioLayout = ({ children }: StudioLayoutProps) => {
  const [showStripeAccountModal, setShowStripeAccountModal] = useState(false);
  const { hasStripeAccount } = useStripeAccountStatus();

  const handleStripeAccount = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!hasStripeAccount) {
      e.preventDefault(); // Ngăn chặn hành động chuyển hướng
      setShowStripeAccountModal(true);
    }
  };

  return (
    <SidebarProvider>
      <StudioSidebar />
      <SidebarInset>
        <ArtistStudioHeader />
        {children}
      </SidebarInset>
      <StripeAccountRequiredModal
        open={showStripeAccountModal}
        onOpenChange={setShowStripeAccountModal}
        onCancel={() => setShowStripeAccountModal(false)}
      />
    </SidebarProvider>
  );
};

export default StudioLayout;
