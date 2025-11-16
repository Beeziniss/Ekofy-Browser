import { UserRole } from "@/types/role";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Get auth data from cookies (since localStorage isn't available in middleware)
  const authStorage = request.cookies.get("auth-storage")?.value;

  let user = null;
  let isAuthenticated = false;

  if (authStorage) {
    try {
      const decodedValue = decodeURIComponent(authStorage);
      const authData = JSON.parse(decodedValue);
      user = authData.state?.user;
      isAuthenticated = authData.state?.isAuthenticated || false;
      request.headers.set("x-user-id", user?.id);
    } catch (error) {
      console.error("Failed to parse auth storage:", error);
    }
  }

  // Allow public artist listing/detail pages under /artists (plural) to be accessible
  // (these should be public pages for listeners/guests)
  if (pathname === "/artists" || pathname.startsWith("/artists/")) {
    return NextResponse.next();
  }

  // Restrict access to /profile routes for artist, moderator, and admin roles
  if (pathname.startsWith("/profile")) {
    if (isAuthenticated && user && [UserRole.ARTIST, UserRole.MODERATOR, UserRole.ADMIN].includes(user.role)) {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  // Restrict moderators and admins from accessing ANY listener-related pages
  const listenerRoutes = [
    "/", // homepage
    "/library",
    "/playlists",
    "/search",
    "/subscription",
    "/track",
    "/request-hub",
    "/artists-for-hire",
    "/login", // listener login
    "/sign-up", // listener sign-up
  ];

  const isListenerRoute = listenerRoutes.some(
    (route) => pathname === route || (route !== "/" && pathname.startsWith(route)),
  );

  if (isListenerRoute && isAuthenticated && user && [UserRole.MODERATOR, UserRole.ADMIN].includes(user.role)) {
    // Redirect to their appropriate dashboard
    const dashboardPath = user.role === UserRole.ADMIN ? "/admin/user-management" : "/moderator/track-approval";
    url.pathname = dashboardPath;
    return NextResponse.redirect(url);
  }

  // Define protected routes and their required roles (excluding login pages)
  // IMPORTANT: the artist regex is written so it only matches the singular "/artist"
  // segment (e.g. /artist/studio, /artist, etc.) and will NOT match "/artists/..."
  const roleBasedRoutes = {
    admin: /^\/admin(?!\/login)/,
    moderator: /^\/moderator(?!\/login)/,
    // require that "/artist" is followed by either a slash or end-of-string,
    // and exclude "/artist/login" and "/artist/sign-up"
    artist: /^\/artist(\/(?!login|sign-up).*)?$/,
  };

  // Check if current path matches any protected route
  const getRequiredRole = (path: string) => {
    if (roleBasedRoutes.admin.test(path)) return UserRole.ADMIN;
    if (roleBasedRoutes.moderator.test(path)) return UserRole.MODERATOR;
    if (roleBasedRoutes.artist.test(path)) return UserRole.ARTIST;
    return null;
  };

  const requiredRole = getRequiredRole(pathname);

  // If this is a protected route
  if (requiredRole) {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      // Redirect to appropriate login page
      const loginPath =
        requiredRole === UserRole.ADMIN
          ? "/admin/login"
          : requiredRole === UserRole.MODERATOR
            ? "/moderator/login"
            : requiredRole === UserRole.ARTIST
              ? "/artist/login"
              : "/login";

      url.pathname = loginPath;
      return NextResponse.redirect(url);
    }

    // Check if user has the required role
    if (user.role !== requiredRole) {
      // Special case: Artists can navigate between homepage and artist areas
      if (user.role === UserRole.ARTIST && requiredRole === UserRole.ARTIST) {
        return NextResponse.next();
      }

      // Redirect to appropriate dashboard or unauthorized page
      const redirectPath =
        user.role === UserRole.ADMIN
          ? "/admin/user-management"
          : user.role === UserRole.MODERATOR
            ? "/moderator/track-approval"
            : user.role === UserRole.ARTIST
              ? "/artist/studio"
              : "/";

      url.pathname = redirectPath;
      return NextResponse.redirect(url);
    }
  }

  // Allow authenticated artists to access homepage freely
  if (pathname === "/" && user?.role === UserRole.ARTIST) {
    return NextResponse.next();
  }

  // Prevent authenticated users from accessing ANY login pages (regardless of role)
  const authPagePatterns = [/^\/admin\/login$/, /^\/moderator\/login$/, /^\/artist\/login$/, /^\/artist\/sign-up$/];

  const isAuthPage = authPagePatterns.some((pattern) => pattern.test(pathname));

  if (isAuthPage && isAuthenticated && user) {
    // Redirect to appropriate dashboard based on user's role
    const dashboardPath =
      user.role === UserRole.ADMIN
        ? "/admin/user-management"
        : user.role === UserRole.MODERATOR
          ? "/moderator/track-approval"
          : user.role === UserRole.ARTIST
            ? "/artist/studio"
            : "/";

    url.pathname = dashboardPath;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * - static files (/_next/, /favicon.ico etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
