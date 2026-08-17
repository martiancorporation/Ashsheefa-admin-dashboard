import { NextResponse } from "next/server";

function isAuthenticated(request) {
  const authCookie = request.cookies.get("authentications");
  if (!authCookie || !authCookie.value) return false;

  try {
    const authData = JSON.parse(authCookie.value);
    return Boolean(authData && authData.access_token);
  } catch (error) {
    return false;
  }
}

export function middleware(request) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;
  const authed = isAuthenticated(request);

  // Check if the route is a dashboard route
  if (pathname.startsWith("/dashboard") && !authed) {
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in and hitting the login page: send to the dashboard.
  // This is decided server-side (cookie is the source of truth) so the
  // client never has to race its own redirect against this one.
  if (pathname === "/" && authed) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
