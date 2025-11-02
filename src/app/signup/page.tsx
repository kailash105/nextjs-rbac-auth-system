import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";
import { getSessionUser } from "@/lib/auth";
import { getDashboardRedirect } from "@/lib/roleGuard";

export default async function SignupPage() {
  const user = await getSessionUser();

  if (user) {
    redirect(getDashboardRedirect(user.role));
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 md:flex-row md:items-center">
      <div className="flex-1 space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          Create your workspace in minutes
        </h1>
        <p className="text-sm text-slate-600">
          Sign up as a client, HR partner, or admin. Invite colleagues and start
          collaborating with role-based permissions.
        </p>
      </div>
      <SignupForm />
    </div>
  );
}


