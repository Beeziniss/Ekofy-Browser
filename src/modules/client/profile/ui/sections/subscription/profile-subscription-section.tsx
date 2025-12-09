"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { userActiveSubscriptionOptions } from "@/gql/options/client-options";
import {
  listenerPremiumEntitlementsQueryOptions,
  subscriptionsPremiumQueryOptions,
} from "@/gql/options/subscription-clients-options";
import {
  subscriptionCancelMutationOptions,
  subscriptionResumeMutationOptions,
} from "@/gql/options/client-mutation-options";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useAuthStore } from "@/store";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import { useQuery, useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addDays, isWithinInterval } from "date-fns";

const ProfileSubscriptionSection = () => {
  return (
    <Suspense fallback={<ProfileSubscriptionSectionSkeleton />}>
      <ProfileSubscriptionSectionSuspense />
    </Suspense>
  );
};

const ProfileSubscriptionSectionSkeleton = () => {
  return (
    <div className="flex flex-col space-y-6">
      <Link
        href="/profile"
        className="text-main-white hover:border-main-white flex w-fit items-center gap-x-2 border-b border-transparent pb-0.5 text-sm transition"
      >
        <ArrowLeftIcon className="size-4" />
        Back to profile
      </Link>

      <h1 className="text-4xl font-semibold">Manage your subscription</h1>

      <Card className="p-0 pb-6">
        <CardContent className="p-0">
          <div className="bg-main-purple text-main-white flex items-center rounded-tl-md rounded-tr-md px-6 py-10 text-2xl font-semibold">
            <Skeleton className="h-8 w-48" />
          </div>

          <div className="p-6">
            <ul className="flex flex-col gap-y-2">
              {[...Array(4)].map((_, index) => (
                <li key={index} className="flex items-center gap-x-2">
                  <CheckIcon className="size-6 text-emerald-500" />
                  <Skeleton className="h-6 w-64" />
                </li>
              ))}
            </ul>
          </div>

          <div className="px-6">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ProfileSubscriptionSectionSuspense = () => {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);

  const { data: subscriptionsPremium } = useSuspenseQuery(subscriptionsPremiumQueryOptions());
  const { data: listenerPremiumEntitlements } = useSuspenseQuery(listenerPremiumEntitlementsQueryOptions());
  const { data: userSubscription } = useQuery({
    ...userActiveSubscriptionOptions(user?.userId || ""),
    enabled: !!user?.userId && !!user.listenerId && isAuthenticated,
  });

  const subscription = subscriptionsPremium?.subscriptions?.items?.[0];

  // Cancel subscription mutation
  const { mutate: cancelSubscription, isPending: isCanceling } = useMutation({
    ...subscriptionCancelMutationOptions,
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["user-active-subscription"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions-premium"] });
      queryClient.invalidateQueries({ queryKey: ["listener-premium-entitlements"] });

      toast.success("Subscription cancelled successfully");
      router.push("/profile/cancel/success");
    },
    onError: (error) => {
      console.error("Failed to cancel subscription:", error);
      toast.error("Failed to cancel subscription. Please try again.");
    },
  });

  // Resume subscription mutation
  const { mutate: resumeSubscription, isPending: isResuming } = useMutation({
    ...subscriptionResumeMutationOptions,
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["user-active-subscription"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions-premium"] });
      queryClient.invalidateQueries({ queryKey: ["listener-premium-entitlements"] });

      toast.success("Subscription resumed successfully");
      router.push("/profile/resume/success");
    },
    onError: (error) => {
      console.error("Failed to resume subscription:", error);
      toast.error("Failed to resume subscription. Please try again.");
    },
  });

  // Check if user can resume subscription (only when subscription is set to cancel)
  const canResumeSubscription = () => {
    if (!userSubscription?.cancelAtEndOfPeriod) return false;
    return true;
  };

  // Check if user is within 3 days before subscription end
  const isWithin3DaysBeforeEnd = () => {
    if (!userSubscription?.periodEnd) return false;

    const now = new Date();
    const endDate = new Date(userSubscription.periodEnd);
    const threeDaysBeforeEnd = addDays(endDate, -3);

    return isWithinInterval(now, {
      start: threeDaysBeforeEnd,
      end: endDate,
    });
  };

  const handleCancelConfirm = () => {
    cancelSubscription();
    setCancelDialogOpen(false);
  };

  const handleResumeConfirm = () => {
    resumeSubscription();
    setResumeDialogOpen(false);
  };

  const formatPeriodEndDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (userSubscription?.subscriptionId !== subscription?.id) {
    return (
      <div className="flex flex-col space-y-6">
        <Link
          href="/profile"
          className="text-main-white hover:border-main-white flex w-fit items-center gap-x-2 border-b border-transparent pb-0.5 text-sm transition"
        >
          <ArrowLeftIcon className="size-4" />
          Back to profile
        </Link>
        <h1 className="text-4xl font-semibold">Manage your subscription</h1>

        <div className="space-y-4">
          <p className="text-main-white/70 text-base">
            You do not have an active {subscription?.name} subscription. Click the button below to explore our premium
            plans and subscribe.
          </p>
        </div>
        <div>
          <Link href="/subscription">
            <Button className="w-full text-base font-medium" size={"lg"} variant={"ekofy"}>
              Explore Premium Plans
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  console.log(JSON.stringify(userSubscription, null, 2));

  return (
    <>
      <div className="flex flex-col space-y-6">
        <Link
          href="/profile"
          className="text-main-white hover:border-main-white flex w-fit items-center gap-x-2 border-b border-transparent pb-0.5 text-sm transition"
        >
          <ArrowLeftIcon className="size-4" />
          Back to profile
        </Link>

        <h1 className="text-4xl font-semibold">Manage your subscription</h1>

        <Card className="p-0 pb-6">
          <CardContent className="p-0">
            {/* <pre>{JSON.stringify({ premiumSubscription, userSubscription }, null, 2)}</pre> */}
            <div className="bg-main-purple text-main-white flex items-center rounded-tl-md rounded-tr-md px-6 py-10 text-2xl font-semibold">
              {subscription?.name}
            </div>

            <div className="p-6">
              <ul className="flex flex-col gap-y-2">
                {listenerPremiumEntitlements.entitlements?.items?.map((entitlement) => (
                  <li key={entitlement.id} className="flex items-center gap-x-2">
                    <CheckIcon className="size-6 text-emerald-500" />
                    <span className="text-main-white text-base">{entitlement.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full space-y-5 px-6 pb-6">
              <Separator className="w-full" />

              <div className="space-y-3">
                {userSubscription?.cancelAtEndOfPeriod ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        Cancellation Scheduled
                      </Badge>
                    </div>
                    <div>
                      Your subscription will change to Ekofy Free on{" "}
                      <span className="text-main-purple font-medium">
                        {userSubscription?.periodEnd && formatPeriodEndDate(userSubscription.periodEnd)}
                      </span>
                      .
                    </div>
                  </div>
                ) : (
                  <div>
                    Your next bill is for{" "}
                    <span className="text-main-purple font-medium">
                      {Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                        subscription?.amount || 0,
                      )}
                    </span>{" "}
                    on {userSubscription?.periodEnd && formatPeriodEndDate(userSubscription.periodEnd)}.
                  </div>
                )}
              </div>

              <Separator className="w-full" />
            </div>

            <div className="space-y-3 px-6">
              {/* Show Resume button if subscription is cancelled */}
              {canResumeSubscription() && (
                <>
                  <Button
                    className="w-full text-base font-medium"
                    size={"lg"}
                    variant={"ekofy"}
                    onClick={() => setResumeDialogOpen(true)}
                    disabled={isResuming}
                  >
                    {isResuming ? "Resuming..." : "Resume Subscription"}
                  </Button>
                  <p className="text-main-white/70 text-center text-sm">
                    You can resume your subscription before it expires.
                  </p>
                </>
              )}

              {/* Cancel Subscription Button - only show if not already set to cancel and not within 3 days before end */}
              {!userSubscription?.cancelAtEndOfPeriod && !isWithin3DaysBeforeEnd() && (
                <Button
                  className="w-full text-base font-medium"
                  size={"lg"}
                  variant={"destructive"}
                  onClick={() => setCancelDialogOpen(true)}
                  disabled={isCanceling}
                >
                  {isCanceling ? "Canceling..." : "Cancel Subscription"}
                </Button>
              )}

              {/* Show message when within 3 days before end and subscription is active */}
              {!userSubscription?.cancelAtEndOfPeriod && isWithin3DaysBeforeEnd() && (
                <div className="text-main-white/70 rounded-md border border-yellow-500/20 bg-yellow-500/10 p-4 text-center text-sm">
                  You cannot cancel your subscription within 3 days before the renewal date.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cancel Subscription Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              If you cancel, you&apos;ll switch over to our free service on{" "}
              {userSubscription?.periodEnd && formatPeriodEndDate(userSubscription.periodEnd)}. Are you sure you want to
              cancel your subscription?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelConfirm}>Yes, cancel</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Resume Subscription Dialog */}
      <AlertDialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resume Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to resume your subscription? Your billing will continue as normal from your next
              billing date.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResumeConfirm}>Yes, Resume</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProfileSubscriptionSection;
