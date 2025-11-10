import { useQuery } from "@tanstack/react-query";
import { userStripeAccountOptions } from "@/gql/options/stripe-options";
import { useAuthStore } from "@/store";
import { UserRole } from "@/types/role";

export const useStripeAccountStatus = () => {
  const { user } = useAuthStore();
  
  const { data: stripeAccountData, isLoading, error } = useQuery(
    userStripeAccountOptions(user?.userId || "")
  );

  const hasStripeAccount = Boolean(stripeAccountData?.stripeAccountId);
  const isArtist = user?.role === UserRole.ARTIST;
  const canApplyToRequests = isArtist && hasStripeAccount;

  return {
    hasStripeAccount,
    isArtist,
    canApplyToRequests,
    isLoading,
    error,
    stripeAccountData,
    userId: user?.userId,
    userRole: user?.role,
  };
};