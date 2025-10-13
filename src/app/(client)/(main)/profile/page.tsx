import ProfileView from "../../../../modules/client/profile/ui/views/profile-view";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/get-query-client";
import { listenerProfileOptions, userActiveSubscriptionOptions } from "@/gql/options/client-options";
import { cookies } from "next/headers";

export default async function Page() {
  const queryClient = getQueryClient();

  // Derive userId from persisted auth cookie/localStorage equivalent on server.
  // If you have JWT in cookies, decode it here; placeholder attempts to read userId cookie.
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value || "";

  if (userId) {
    await queryClient.prefetchQuery(listenerProfileOptions(userId));
    await queryClient.prefetchQuery(userActiveSubscriptionOptions(userId));
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileView />
    </HydrationBoundary>
  );
}
