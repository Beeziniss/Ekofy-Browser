"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface RouteItem {
  path: string;
  label: string;
  description?: string;
}

// Define your app routes here
const APP_ROUTES: RouteItem[] = [
  // Public routes
  { path: "/", label: "Home", description: "Main homepage" },
  { path: "/artists", label: "Artists", description: "Browse all artists" },
  { path: "/library", label: "Library", description: "Your music library" },
  { path: "/request-hub", label: "Request Hub", description: "Music requests" },
  {
    path: "/artists-for-hire",
    label: "Artists for Hire",
    description: "Hire professional artists",
  },

  // Auth routes
  /* {
    path: "/admin/login",
    label: "Admin Login",
    description: "Admin authentication",
  },
  {
    path: "/moderator/login",
    label: "Moderator Login",
    description: "Moderator authentication",
  }, */
  {
    path: "/artist/login",
    label: "Artist Login",
    description: "Artist authentication",
  },
  {
    path: "/artist/sign-up",
    label: "Artist Sign Up",
    description: "Register as an artist",
  },

  // Admin routes
  /* {
    path: "/admin/user-management",
    label: "User Management",
    description: "Manage platform users",
  },
  {
    path: "/admin/subscription",
    label: "Manage Subscription",
    description: "Subscription management",
  }, */

  // Moderator routes
  /* {
    path: "/moderator/track-approval",
    label: "Track Approval",
    description: "Approve submitted tracks",
  },
  {
    path: "/moderator/report-control",
    label: "Report Control",
    description: "Handle user reports",
  },
  {
    path: "/moderator/artist-approval",
    label: "Artist Approval",
    description: "Approve new artists",
  },
  {
    path: "/moderator/user-management",
    label: "User Management",
    description: "Manage users",
  },
  {
    path: "/moderator/approval-histories",
    label: "Approval Histories",
    description: "View approval history",
  },
  {
    path: "/moderator/approval-service-packages",
    label: "Approval Service Packages",
    description: "Approve service packages",
  }, */

  // Artist routes
  {
    path: "/artist/studio",
    label: "Artist Studio",
    description: "Artist dashboard",
  },
  {
    path: "/artist/studio/tracks",
    label: "My Tracks",
    description: "Manage your tracks",
  },
  {
    path: "/artist/studio/albums",
    label: "My Albums",
    description: "Manage your albums",
  },
  {
    path: "/artist/studio/service-package",
    label: "Service Packages",
    description: "Manage service packages",
  },
  {
    path: "/artist/studio/profile",
    label: "Artist Profile",
    description: "Edit your artist profile",
  },
  {
    path: "/artist/track-upload",
    label: "Upload Track",
    description: "Upload new music",
  },
];

export const useRouteSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RouteItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    // Simple search implementation
    const searchTerm = query.toLowerCase();
    const filtered = APP_ROUTES.filter(
      (route) =>
        route.label.toLowerCase().includes(searchTerm) ||
        route.path.toLowerCase().includes(searchTerm) ||
        route.description?.toLowerCase().includes(searchTerm),
    );

    // Sort by relevance (exact matches first, then label matches, then description matches)
    filtered.sort((a, b) => {
      const aLabel = a.label.toLowerCase();
      const bLabel = b.label.toLowerCase();
      const aPath = a.path.toLowerCase();
      const bPath = b.path.toLowerCase();

      // Exact label match gets highest priority
      if (aLabel === searchTerm) return -1;
      if (bLabel === searchTerm) return 1;

      // Exact path match
      if (aPath === searchTerm) return -1;
      if (bPath === searchTerm) return 1;

      // Label starts with search term
      if (aLabel.startsWith(searchTerm) && !bLabel.startsWith(searchTerm)) return -1;
      if (bLabel.startsWith(searchTerm) && !aLabel.startsWith(searchTerm)) return 1;

      // Path starts with search term
      if (aPath.startsWith(searchTerm) && !bPath.startsWith(searchTerm)) return -1;
      if (bPath.startsWith(searchTerm) && !aPath.startsWith(searchTerm)) return 1;

      return 0;
    });

    setResults(filtered.slice(0, 10)); // Limit to 10 results
    setIsSearching(false);
  }, [query]);

  const navigateToRoute = (path: string) => {
    router.push(path);
  };

  const handleKeyPress = (event: KeyboardEvent, selectedIndex?: number) => {
    if (event.key === "Enter" && results.length > 0) {
      const targetResult = selectedIndex !== undefined ? results[selectedIndex] : results[0];
      if (targetResult) {
        navigateToRoute(targetResult.path);
      }
    }
  };

  return {
    query,
    setQuery,
    results,
    isSearching,
    navigateToRoute,
    handleKeyPress,
  };
};
