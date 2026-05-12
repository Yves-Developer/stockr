import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        //get the cookie from the request
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  const isScannerPage = request.nextUrl.pathname === "/scanner";
  const hasMagicToken = request.nextUrl.searchParams.has("token");

  if (!session) {
    // If it's the scanner page and we have a magic token, allow it so the page can handle login
    if (isScannerPage && hasMagicToken) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/scanner/:path*", "/scanner"],
};
