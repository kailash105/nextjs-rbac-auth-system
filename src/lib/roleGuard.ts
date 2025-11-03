import type { UserRole } from "@/types";

export const ROLE_DASHBOARD_ROUTE: Record<UserRole, string> = {
  client: "/dashboard/client",
  hr: "/dashboard/hr",
  admin: "/dashboard/admin",
};

const ROLE_ALLOWED_PREFIXES: Record<UserRole, string[]> = {
  client: ["/dashboard/client", "/api/users", "/api/contact"],
  hr: ["/dashboard/hr", "/api/users", "/api/contact"],
  admin: ["/dashboard/admin", "/dashboard/client", "/dashboard/hr", "/api/users", "/api/contact"],
};

export function canAccessPath(role: UserRole, pathname: string) {
  const allowed = ROLE_ALLOWED_PREFIXES[role] ?? [];
  return allowed.some((prefix) => pathname.startsWith(prefix));
}

export function getDashboardRedirect(role: UserRole) {
  return ROLE_DASHBOARD_ROUTE[role];
}

export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/logout",
];


