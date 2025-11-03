import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { ensureDbConnected } from "@/lib/db";
import UserModel from "@/models/User";

export const GET = withAuth(async (_request, { user }) => {
  return NextResponse.json({ user });
});

export const PUT = withAuth(async (request, { user }) => {
  const body = await request.json().catch(() => null as unknown);
  const name = (body && typeof body === "object" && (body as { name?: unknown }).name) as
    | string
    | undefined;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ message: "Invalid name" }, { status: 400 });
  }

  await ensureDbConnected();

  const doc = await UserModel.findById(user._id);
  if (!doc) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  doc.name = name.trim();
  await doc.save();

  return NextResponse.json({ message: "Profile updated" });
});
