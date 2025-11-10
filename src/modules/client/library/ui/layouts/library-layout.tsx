"use client";

import { useAuthStore } from "@/store";
import UnauthenticatedMessage from "../components/unauthenticated-message";
import AuthenticatedLibraryLayout from "../components/authenticated-library-layout";

interface LibraryLayoutProps {
  children: React.ReactNode;
}

const LibraryLayout = ({ children }: LibraryLayoutProps) => {
  const { user, isAuthenticated } = useAuthStore();

  // If user is not authenticated, show the unauthenticated message
  if (!isAuthenticated || !user) {
    return (
      <div className="w-full px-6 pt-6">
        <h1 className="text-5xl font-bold">Library</h1>
        <UnauthenticatedMessage />
      </div>
    );
  }

  // If authenticated, render the authenticated layout with suspense queries
  return <AuthenticatedLibraryLayout>{children}</AuthenticatedLibraryLayout>;
};

export default LibraryLayout;
