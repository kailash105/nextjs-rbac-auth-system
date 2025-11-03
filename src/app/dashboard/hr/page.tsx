import { redirect } from "next/navigation";
import { HrDashboard } from "@/components/dashboard/hr-dashboard";
import { getSessionUser } from "@/lib/auth";
import { getDashboardRedirect } from "@/lib/roleGuard";

export default async function HrDashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "hr") {
    redirect(getDashboardRedirect(user.role));
  }

  return <HrDashboard user={user} />;
}


