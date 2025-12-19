"use client";

import Link from "next/link";
import { Atom } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SparklesText } from "@/components/ui/sparkles-text";
import { useAuthStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { userActiveSubscriptionOptions } from "@/gql/options/client-options";
import { SubscriptionTier } from "@/gql/graphql";

const SemanticIcon = () => {
  const { user, isAuthenticated } = useAuthStore();

  const { data: activeSubscription } = useQuery({
    ...userActiveSubscriptionOptions(user?.userId || ""),
    enabled: isAuthenticated && !!user?.userId,
  });

  // Only show for Premium or Pro subscription users
  const hasAccess =
    activeSubscription?.subscription?.[0]?.tier === SubscriptionTier.Premium ||
    activeSubscription?.subscription?.[0]?.tier === SubscriptionTier.Pro;

  if (!isAuthenticated || !hasAccess) {
    return null;
  }

  return (
    <Link href={"/semantic-search"} className="group">
      <Button variant={"ghost"} className="rounded-full">
        {/* <Atom className="text-main-purple/85 size-5" />
        <span className="text-main-purple/85">Smart Search</span> */}
        <SparklesText className="text-lg leading-5" colors={{ first: "#3b54ea", second: "#ab4ee5" }}>
          <div className="flex items-center gap-x-2 text-lg">
            <Atom className="size-5" />
            Smart Search
          </div>
        </SparklesText>
      </Button>
    </Link>
  );
};

export default SemanticIcon;
