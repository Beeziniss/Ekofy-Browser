"use client";

import { useAuthStore } from "@/store";
import LibNavigationMenu from "../components/lib-navigation-menu";
import UnauthenticatedMessage from "../components/unauthenticated-message";

interface LibraryLayoutProps {
  children: React.ReactNode;
}

const LibraryLayout = ({ children }: LibraryLayoutProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <div className="w-full px-6 pt-6">
        <h1 className="text-5xl font-bold">Library</h1>
        <UnauthenticatedMessage />
      </div>
    );
  }

  return (
    <div className="w-full px-6 pt-6">
      {/* Title */}
      <h1 className="text-5xl font-bold">Library</h1>

      {/* Tabs Management */}
      <div className="mt-6 space-y-6">
        <LibNavigationMenu />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default LibraryLayout;
