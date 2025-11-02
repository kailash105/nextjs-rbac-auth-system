import { redirect } from "next/navigation";
import { ClientDashboard } from "@/components/dashboard/client-dashboard";
import { getSessionUser } from "@/lib/auth";
import { getDashboardRedirect } from "@/lib/roleGuard";

export default async function ClientDashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "client") {
    redirect(getDashboardRedirect(user.role));
  }

  return <ClientDashboard user={user} />;
}


