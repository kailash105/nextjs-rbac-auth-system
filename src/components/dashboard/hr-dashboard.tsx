"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContactRecord, PublicUser } from "@/types";

interface HrDashboardProps {
  user: PublicUser;
}

interface UsersResponse {
  users: PublicUser[];
}

interface ContactResponse {
  contacts: ContactRecord[];
}

export function HrDashboard({ user }: HrDashboardProps) {
  const [clients, setClients] = useState<PublicUser[]>([]);
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
          throw new Error("Unable to load client list");
        }
        if (!contactResponse.ok) {
          throw new Error("Unable to load contact history");
        }

        const usersJson = (await usersResponse.json()) as UsersResponse;
        const contactsJson = (await contactResponse.json()) as ContactResponse;

        setClients(usersJson.users ?? []);
        setContacts(contactsJson.contacts ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Welcome back, {user.name}</h2>
        <p className="text-sm text-slate-600">
          Review which clients have reached out and follow up promptly to keep
          conversations moving.
        </p>
      </div>

      {error ? (
        <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>New client introductions</CardTitle>
          <CardDescription>
            Clients that have requested to connect with you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-500">Loading clients...</p>
          ) : clients.length === 0 ? (
            <p className="text-sm text-slate-500">
              No client introductions yet. You&apos;ll see them here once clients
              reach out.
            </p>
          ) : (
            <ul className="space-y-3">
              {clients.map((client) => (
                <li
                  key={client._id}
                  className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2"
                >
                  <span className="text-sm font-medium text-slate-900">
                    {client.name}
                  </span>
                  <span className="text-xs text-slate-500">{client.email}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Interaction history</CardTitle>
          <CardDescription>
            Track every outreach chronologically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p className="text-sm text-slate-500">No interactions yet.</p>
          ) : (
            <ul className="space-y-3 text-sm text-slate-600">
              {contacts.map((contact) => (
                <li
                  key={contact._id}
                  className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2"
                >
                  <span className="flex items-center gap-2 text-slate-900">
                    {contact.client.name}
                    <Badge variant="secondary">{contact.client.email}</Badge>
                  </span>
                  <span className="text-xs text-slate-500">
                    Reached out on {new Date(contact.createdAt).toLocaleString()}
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


