import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { ROLE_DASHBOARD_ROUTE } from "@/lib/roleGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";

export async function SiteHeader() {
  const user = await getSessionUser();
  const dashboardPath = user ? ROLE_DASHBOARD_ROUTE[user.role] : "/login";

  return (
    <header className="border-b border-slate-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-sm font-bold text-white">
            RB
          </span>
          <span className="hidden text-base sm:inline">
            Role-Based Access
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Badge variant="secondary" className="capitalize">
                {user.role}
              </Badge>
              <Link href={dashboardPath}>
                <Button size="sm">Dashboard</Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="sm">Profile</Button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


