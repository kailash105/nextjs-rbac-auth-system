import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { getSessionUser } from "@/lib/auth";
import { getDashboardRedirect } from "@/lib/roleGuard";

export default async function AdminDashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect(getDashboardRedirect(user.role));
  }

  return <AdminDashboard user={user} />;
}


