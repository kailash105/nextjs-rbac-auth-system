import { cookies } from "next/headers";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import type { NextRequest, NextResponse as NextResponseType } from "next/server";
import { ensureDbConnected } from "@/lib/db";
import UserModel from "@/models/User";
import type { JwtPayload, PublicUser, UserRole } from "@/types";

const AUTH_COOKIE = "auth-token";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing environment variable: JWT_SECRET");
  }
  return secret;
}

export function sanitizeUser<T extends { password?: unknown }>(user: T): Omit<T, "password"> {
  const clone = { ...(user as Record<string, unknown>) };
  delete clone.password;
  return clone as Omit<T, "password">;
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_TTL_SECONDS });
}

export function verifyToken(token: string) {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_TTL_SECONDS,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export async function getSessionUser(): Promise<PublicUser | null> {
  try {
    let token: string | null = null;
    
    try {
      // cookies() returns a Promise in Next.js 16
      const cookieStore = await cookies();
      token = cookieStore.get(AUTH_COOKIE)?.value || null;
    } catch (cookieError) {
      // Fallback to headers() if cookies() fails
      try {
        const headersList = await headers();
        const cookieHeader = headersList.get('cookie');
        if (cookieHeader) {
          const cookieMap = cookieHeader.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
          }, {} as Record<string, string>);
          token = cookieMap[AUTH_COOKIE] || null;
        }
      } catch (headerError) {
        // Both methods failed, return null
        return null;
      }
    }
    
    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    
    // Gracefully handle MongoDB connection errors when DB is not configured
    try {
      await ensureDbConnected();
      const user = await UserModel.findById(payload.sub).lean();
      if (!user || Array.isArray(user)) {
        return null;
      }
      const userData = {
        ...user,
        _id: (user._id as { toString(): string }).toString(),
      };
      return sanitizeUser(userData as any) as PublicUser;
    } catch (dbError) {
      // MongoDB not available - return null silently for frontend-only mode
      console.log("Database not available, skipping user lookup");
      return null;
    }
  } catch (error) {
    // Any error - return null silently for frontend-only mode
    return null;
  }
}

interface WithAuthOptions {
  roles?: UserRole[];
}

type AuthenticatedUser = PublicUser & { role: UserRole };

type AuthHandler = (
  request: NextRequest,
  context: { user: AuthenticatedUser; tokenPayload: JwtPayload }
) => Promise<NextResponseType> | NextResponseType;

export function withAuth(handler: AuthHandler, options: WithAuthOptions = {}) {
  return async (request: NextRequest) => {
    const token = request.cookies.get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      const payload = verifyToken(token);

      if (options.roles && !options.roles.includes(payload.role)) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }

      await ensureDbConnected();
      const userDoc = await UserModel.findById(payload.sub).lean();

      if (!userDoc || Array.isArray(userDoc)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const userData = {
        ...userDoc,
        _id: (userDoc._id as { toString(): string }).toString(),
      };
      const user: AuthenticatedUser = sanitizeUser(userData as any) as AuthenticatedUser;

      return handler(request, { user, tokenPayload: payload });
    } catch (error) {
      console.error("Auth error", error);
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  };
}

export { AUTH_COOKIE };


