import Link from "next/link";
import { ArrowRight, ShieldCheck, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <section className="space-y-12">
      <div className="grid gap-8 rounded-3xl bg-white p-10 shadow-sm md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Production-ready Role Based Access System for Teams
          </h1>
          <p className="text-lg text-slate-600">
            Secure authentication and authorization built with Next.js App Router,
            MongoDB, JWT, and ShadCN UI. Manage clients, HR partners, and admins
            with clear data boundaries and interactions.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href="/signup">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">
                Sign in
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-slate-900 p-6 text-white">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs uppercase tracking-wide">
            Tech Stack
          </span>
          <ul className="space-y-2 text-sm text-slate-200">
            <li>Next.js 16 App Router + TypeScript</li>
            <li>MongoDB &amp; Mongoose with connection pooling</li>
            <li>JWT auth via httpOnly cookies</li>
            <li>ShadCN UI + Tailwind for modern design</li>
          </ul>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Role-aware dashboards</CardTitle>
              <CardDescription>
                Dedicated workspaces for client, HR, and admin personas.
              </CardDescription>
            </div>
            <ShieldCheck className="h-6 w-6 text-slate-400" />
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Middleware enforces access while server helpers validate JWT tokens
            before every critical request.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Auditable interactions</CardTitle>
              <CardDescription>
                Capture when clients reach out to HR and surface visibility per role.
              </CardDescription>
            </div>
            <UsersRound className="h-6 w-6 text-slate-400" />
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Clients discover HR specialists, HR sees only their inbound requests,
            and admins have complete oversight.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Deploy anywhere</CardTitle>
            <CardDescription>
              Ready for Vercel frontend hosting &amp; Render Mongo services.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Follow the deployment guide to launch in minutes with optimized build
            steps and environment variables.
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
