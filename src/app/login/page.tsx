import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { getSessionUser } from "@/lib/auth";
import { getDashboardRedirect } from "@/lib/roleGuard";

export default async function LoginPage() {
  const user = await getSessionUser();

  if (user) {
    redirect(getDashboardRedirect(user.role));
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 md:flex-row md:items-center">
      <div className="flex-1 space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          Sign in and continue where you left off
        </h1>
        <p className="text-sm text-slate-600">
          Access your personalized dashboard, manage interactions, and stay
          aligned with your team&apos;s workflow.
        </p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}


