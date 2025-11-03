"use client";

import { useState, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  initialName: string;
  email: string;
  role: string;
  dashboardPath: string;
}

export function ProfileClient({ initialName, email, role, dashboardPath }: Props) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [changeMsg, setChangeMsg] = useState<string | null>(null);
  const [changeErr, setChangeErr] = useState<string | null>(null);

  const onSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setSaveMsg(null);
    setSaveErr(null);
    setSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to update profile");
      setSaveMsg("Profile updated");
    } catch (err) {
      setSaveErr(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setChangeMsg(null);
    setChangeErr(null);
    setChanging(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to change password");
      setChangeMsg("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setChangeErr(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Account</h2>
          <p className="text-sm text-slate-600">Update basic profile info.</p>
        </div>
        <form onSubmit={onSaveProfile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={role} disabled className="capitalize" />
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={saving}>Save</Button>
            <Link className="text-sm text-slate-600 underline" href={dashboardPath}>Back to dashboard</Link>
          </div>
          {saveMsg && <p className="text-sm text-green-600">{saveMsg}</p>}
          {saveErr && <p className="text-sm text-red-600">{saveErr}</p>}
        </form>
      </Card>

      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
          <p className="text-sm text-slate-600">Use a strong, unique password.</p>
        </div>
        <form onSubmit={onChangePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current">Current Password</Label>
            <Input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new">New Password</Label>
            <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
          </div>
          <div>
            <Button type="submit" disabled={changing}>Change Password</Button>
          </div>
          {changeMsg && <p className="text-sm text-green-600">{changeMsg}</p>}
          {changeErr && <p className="text-sm text-red-600">{changeErr}</p>}
        </form>
      </Card>
    </div>
  );
}


