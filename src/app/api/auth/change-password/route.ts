import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { ensureDbConnected } from "@/lib/db";
import UserModel from "@/models/User";

export const POST = withAuth(async (request, { user }) => {
  const body = await request.json().catch(() => null as unknown);
  const currentPassword =
    body && typeof body === "object" ? (body as { currentPassword?: unknown }).currentPassword : undefined;
  const newPassword =
    body && typeof body === "object" ? (body as { newPassword?: unknown }).newPassword : undefined;

  if (typeof currentPassword !== "string" || currentPassword.length < 1) {
    return NextResponse.json({ message: "Current password is required" }, { status: 400 });
  }
  if (typeof newPassword !== "string" || newPassword.length < 6) {
    return NextResponse.json({ message: "New password must be at least 6 characters" }, { status: 400 });
  }

  await ensureDbConnected();

  const doc = await UserModel.findById(user._id);
  if (!doc) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const valid = await doc.comparePassword(currentPassword);
  if (!valid) {
    return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
  }

  doc.password = newPassword;
  await doc.save();

  return NextResponse.json({ message: "Password changed successfully" });
});


