import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { ensureDbConnected } from "@/lib/db";
import UserModel from "@/models/User";
import ContactModel from "@/models/Contact";
import type { PublicUser, UserRole } from "@/types";
import type { Types } from "mongoose";

type LeanUser = {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
};

function toPublicUser(user: LeanUser): PublicUser {
  return {
    _id: user._id?.toString?.() ?? String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } satisfies PublicUser;
}

export const GET = withAuth(async (request, { user }) => {
  await ensureDbConnected();

  if (user.role === "client") {
    const hrUsers = await UserModel.find({ role: "hr" })
      .select("-password")
      .sort({ name: 1 })
      .lean();

    const contacts = await ContactModel.find({ client: user._id })
      .select("hr")
      .lean();

    const contactedHrIds = new Set(
      contacts.map((contact) => contact.hr.toString())
    );

    return NextResponse.json({
      users: hrUsers.map(toPublicUser),
      meta: { contactedHrIds: Array.from(contactedHrIds) },
    });
  }

  if (user.role === "hr") {
    const contacts = await ContactModel.find({ hr: user._id })
      .populate({ path: "client", select: "-password" })
      .lean();

    const clientsMap = new Map<string, PublicUser>();

    contacts.forEach((contact) => {
      const client = contact.client as LeanUser | undefined;
      if (client) {
        const publicClient = toPublicUser(client);
        clientsMap.set(publicClient._id, publicClient);
      }
    });

    return NextResponse.json({ users: Array.from(clientsMap.values()) });
  }

  const allUsers = await UserModel.find()
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ users: allUsers.map(toPublicUser) });
});


