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
      const authData = JSON.parse(authStorage);
      user = authData.state?.user;
      isAuthenticated = authData.state?.isAuthenticated || false;
    } catch (error) {
      console.error("Failed to parse auth storage:", error);
    }
  }

  // Define protected routes and their required roles (excluding login pages)
  const roleBasedRoutes = {
    admin: /^\/admin(?!\/login)/,
    moderator: /^\/moderator(?!\/login)/,
    artist: /^\/artist(?!\/login)/,
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
          ? "/admin"
          : user.role === UserRole.MODERATOR
            ? "/moderator"
            : user.role === UserRole.ARTIST
              ? "/artist"
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
  const authPagePatterns = [
    /^\/admin\/login$/,
    /^\/moderator\/login$/,
    /^\/artist\/login$/,
  ];

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
    "/artist/(.*)",
    "/admin/(.*)",
    "/moderator/(.*)",
  ],
};
