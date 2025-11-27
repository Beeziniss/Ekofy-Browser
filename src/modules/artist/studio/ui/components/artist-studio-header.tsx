"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CloudUploadIcon, MessageCircle } from "lucide-react";
import { StripeAccountRequiredModal } from "@/modules/client/request-hub";
import { useStripeAccountStatus } from "@/hooks/use-stripe-account-status";

const ArtistStudioHeader = () => {
  const [showStripeAccountModal, setShowStripeAccountModal] = useState(false);
  const { hasStripeAccount } = useStripeAccountStatus();

  const handleStripeAccount = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!hasStripeAccount) {
      e.preventDefault();
      setShowStripeAccountModal(true);
    }
  };

  return (
    <>
      <header className="!bg-main-dark-bg sticky top-0 z-50 flex h-18 items-center justify-between gap-2 border-b border-white/30 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        </div>

        <div className="flex items-center gap-x-2">
          <Link href={"/artist/track-upload"} onClick={handleStripeAccount}>
            <Button variant="outline" size={"lg"}>
              <CloudUploadIcon className="size-5" /> Upload
            </Button>
          </Link>

          <Button variant="ghost" size="iconXs">
            <MessageCircle className="size-4" />
          </Button>
        </div>
      </header>

      <StripeAccountRequiredModal
        open={showStripeAccountModal}
        onOpenChange={setShowStripeAccountModal}
        onCancel={() => setShowStripeAccountModal(false)}
      />
    </>
  );
};

export default ArtistStudioHeader;
