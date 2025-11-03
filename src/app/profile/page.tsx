import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { ROLE_DASHBOARD_ROUTE } from "@/lib/roleGuard";
import { Suspense } from "react";
import { ProfileClient } from "./profileClient";

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  // Allow all roles to access profile; fallback dashboard path for convenience
  const dashboardPath = ROLE_DASHBOARD_ROUTE[user.role];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Profile</h1>
        <p className="text-sm text-slate-600">Manage your account settings.</p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileClient initialName={user.name} email={user.email} role={user.role} dashboardPath={dashboardPath} />
      </Suspense>
    </div>
  );
}


