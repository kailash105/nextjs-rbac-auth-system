import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { ROLE_DASHBOARD_ROUTE, canAccessPath, PUBLIC_ROUTES } from "@/lib/roleGuard";
import type { UserRole } from "@/types";

const AUTH_COOKIE = "auth-token";

async function verifyJwt(token: string) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable");
  }

  const encoder = new TextEncoder();
  return jwtVerify(token, encoder.encode(secret));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (!token) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callback", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await verifyJwt(token);
    const role = payload.role as UserRole | undefined;

    if (!role) {
      throw new Error("Role missing");
    }

    if (pathname.startsWith("/dashboard") || pathname.startsWith("/api")) {
      if (!canAccessPath(role, pathname)) {
        if (pathname.startsWith("/api")) {
          return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = ROLE_DASHBOARD_ROUTE[role];
        return NextResponse.redirect(redirectUrl);
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware auth error", error);

    if (pathname.startsWith("/api")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callback", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/users/:path*", "/api/contact/:path*"],
};


