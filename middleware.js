import { NextResponse } from "next/server";

export function middleware(request) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // Check if the route is a dashboard route
  if (pathname.startsWith("/dashboard")) {
    // Get authentication data from cookies
    const authCookie = request.cookies.get("authentications");

    // If no authentication data exists, redirect to login
    if (!authCookie || !authCookie.value) {
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Try to parse the authentication data
      const authData = JSON.parse(authCookie.value);

      // Check if authData exists and has required fields
      if (!authData || !authData.access_token) {
        const loginUrl = new URL("/", request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      // If parsing fails, redirect to login
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }
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
