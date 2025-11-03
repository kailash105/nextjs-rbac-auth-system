"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContactRecord, PublicUser } from "@/types";

interface ClientDashboardProps {
  user: PublicUser;
}

interface UsersResponse {
  users: PublicUser[];
  meta?: {
    contactedHrIds?: string[];
  };
}

interface ContactResponse {
  contacts: ContactRecord[];
}

export function ClientDashboard({ user }: ClientDashboardProps) {
  const [hrUsers, setHrUsers] = useState<PublicUser[]>([]);
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactingId, setContactingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const contactedHrIds = useMemo(() => {
    return new Set(contacts.map((contact) => contact.hr._id));
  }, [contacts]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const [userResponse, contactResponse] = await Promise.all([
          fetch("/api/users", { credentials: "include" }),
          fetch("/api/contact", { credentials: "include" }),
        ]);

        if (!userResponse.ok) {
          throw new Error("Unable to load HR directory");
        }
        if (!contactResponse.ok) {
          throw new Error("Unable to load contact history");
        }

        const usersJson = (await userResponse.json()) as UsersResponse;
        const contactsJson = (await contactResponse.json()) as ContactResponse;

        setHrUsers(usersJson.users ?? []);
        setContacts(contactsJson.contacts ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleContact = async (hrId: string) => {
    try {
      setContactingId(hrId);
      setError(null);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ hrId }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok && response.status !== 200) {
        throw new Error(data.message ?? "Could not contact HR");
      }

      const refreshed = await fetch("/api/contact", {
        credentials: "include",
      });

      if (refreshed.ok) {
        const refreshedJson = (await refreshed.json()) as ContactResponse;
        setContacts(refreshedJson.contacts ?? []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not contact HR");
    } finally {
      setContactingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Hi {user.name.split(" ")[0]} 👋</h2>
        <p className="text-sm text-slate-600">
          Reach out to HR partners to begin a conversation. You can see everyone
          you&apos;ve already contacted in the activity log below.
        </p>
      </div>

      {error ? (
        <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>HR Directory</CardTitle>
          <CardDescription>
            Browse available HR partners and send an introduction request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-500">Loading HR partners...</p>
          ) : hrUsers.length === 0 ? (
            <p className="text-sm text-slate-500">
              No HR users available yet. Check back soon.
            </p>
          ) : (
            <div className="space-y-4">
              {hrUsers.map((hr) => {
                const contacted = contactedHrIds.has(hr._id);
                return (
                  <div
                    key={hr._id}
                    className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {hr.name}
                      </p>
                      <p className="text-xs text-slate-500">{hr.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {contacted ? (
                        <Badge variant="secondary">Contacted</Badge>
                      ) : null}
                      <Button
                        variant={contacted ? "outline" : "default"}
                        disabled={contacted || contactingId === hr._id}
                        onClick={() => handleContact(hr._id)}
                      >
                        {contacted
                          ? "Already contacted"
                          : contactingId === hr._id
                            ? "Sending..."
                            : "Contact"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity log</CardTitle>
          <CardDescription>
            A list of HR partners you&apos;ve reached out to and when the request was made.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p className="text-sm text-slate-500">No activity yet.</p>
          ) : (
            <ul className="space-y-3 text-sm text-slate-600">
              {contacts.map((contact) => (
                <li
                  key={contact._id}
                  className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2"
                >
                  <span className="font-medium text-slate-900">
                    {contact.hr.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    Contacted on {new Date(contact.createdAt).toLocaleString()}
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


