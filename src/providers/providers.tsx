"use client";
import { QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { getQueryClient } from "./get-query-client";
import { AuthProvider } from "./auth-provider";

import type * as React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_AUTHENTICATION_GOOGLE_CLIENT_ID || ""}>
      <AuthProvider>
        {children}
        {/* <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        /> */}
      </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

