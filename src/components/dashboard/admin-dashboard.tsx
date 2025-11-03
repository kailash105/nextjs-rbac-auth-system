"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContactRecord, PublicUser, UserRole } from "@/types";

interface AdminDashboardProps {
  user: PublicUser;
}

interface UsersResponse {
  users: PublicUser[];
}

interface ContactResponse {
  contacts: ContactRecord[];
}

const ROLE_LABEL: Record<UserRole, string> = {
  client: "Client",
  hr: "HR",
  admin: "Admin",
};

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [usersResponse, contactResponse] = await Promise.all([
          fetch("/api/users", { credentials: "include" }),
          fetch("/api/contact", { credentials: "include" }),
        ]);

        if (!usersResponse.ok) {
          throw new Error("Unable to load users");
        }
        if (!contactResponse.ok) {
          throw new Error("Unable to load contact timeline");
        }

        const usersJson = (await usersResponse.json()) as UsersResponse;
        const contactsJson = (await contactResponse.json()) as ContactResponse;

        setUsers(usersJson.users ?? []);
        setContacts(contactsJson.contacts ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const metrics = useMemo(() => {
    const roleCounts: Record<UserRole, number> = {
      client: 0,
      hr: 0,
      admin: 0,
    };

    users.forEach((u) => {
      roleCounts[u.role as UserRole] += 1;
    });

    return roleCounts;
  }, [users]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Admin overview, {user.name}</h2>
        <p className="text-sm text-slate-600">
          Manage every user and track how teams collaborate across the platform.
        </p>
      </div>

      {error ? (
        <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        {(Object.keys(metrics) as UserRole[]).map((role) => (
          <Card key={role}>
            <CardHeader>
              <CardTitle>{ROLE_LABEL[role]}</CardTitle>
              <CardDescription>Total {ROLE_LABEL[role].toLowerCase()} accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-semibold text-slate-900">
                {metrics[role]}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User directory</CardTitle>
          <CardDescription>All users across the platform grouped by role.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-500">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-slate-500">No users found yet.</p>
          ) : (
            <ul className="space-y-3">
              {users.map((account) => (
                <li
                  key={account._id}
                  className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-900">
                    {account.name}
                    <Badge variant="secondary" className="capitalize">
                      {account.role}
                    </Badge>
                  </span>
                  <span className="text-xs text-slate-500">{account.email}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interaction timeline</CardTitle>
          <CardDescription>Every client ↔ HR interaction recorded in order.</CardDescription>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p className="text-sm text-slate-500">No interactions captured yet.</p>
          ) : (
            <ul className="space-y-3 text-sm text-slate-600">
              {contacts.map((entry) => (
                <li
                  key={entry._id}
                  className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2"
                >
                  <span className="text-slate-900">
                    {entry.client.name} → {entry.hr.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


