import { NextResponse } from "next/server";
import { z } from "zod";
import { withAuth } from "@/lib/auth";
import { ensureDbConnected } from "@/lib/db";
import ContactModel from "@/models/Contact";
import UserModel from "@/models/User";
import type { ContactRecord, UserRole } from "@/types";
import type { Types } from "mongoose";

const createContactSchema = z.object({
  hrId: z.string().min(1, "HR id is required"),
});

type LeanUserRef = {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  role: UserRole;
};

type LeanContact = {
  _id: Types.ObjectId | string;
  client?: LeanUserRef;
  hr?: LeanUserRef;
  createdAt: Date;
};

function serializeContact(contact: LeanContact): ContactRecord {
  const hr = contact.hr;
  const client = contact.client;

  if (!hr || !client) {
    throw new Error("Contact record missing relations");
  }

  return {
    _id: contact._id?.toString?.() ?? String(contact._id),
    createdAt:
      contact.createdAt instanceof Date
        ? contact.createdAt.toISOString()
        : new Date(contact.createdAt).toISOString(),
    hr: {
      _id: hr._id?.toString?.() ?? String(hr._id),
      name: hr.name,
      email: hr.email,
      role: hr.role,
    },
    client: {
      _id: client._id?.toString?.() ?? String(client._id),
      name: client.name,
      email: client.email,
      role: client.role,
    },
  } satisfies ContactRecord;
}

function safeSerialize(contact: LeanContact): ContactRecord | null {
  try {
    return serializeContact(contact);
  } catch (error) {
    console.warn("Skipping malformed contact", error);
    return null;
  }
}

function isDuplicateKeyError(error: unknown): error is { code: number } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "number"
  );
}

export const POST = withAuth(
  async (request, { user }) => {
    const body = await request.json().catch(() => null);
    const parsed = createContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { hrId } = parsed.data;

    try {
      await ensureDbConnected();

      const hrUser = await UserModel.findById(hrId);
      if (!hrUser || hrUser.role !== "hr") {
        return NextResponse.json(
          { message: "HR user not found" },
          { status: 404 }
        );
      }

      const contact = await ContactModel.create({
        client: user._id,
        hr: hrId,
      });

      const populated = await contact.populate([
        { path: "client", select: "-password" },
        { path: "hr", select: "-password" },
      ]);

      return NextResponse.json(
        {
          message: "HR has been notified",
          contact: serializeContact(populated),
        },
        { status: 201 }
      );
    } catch (error: unknown) {
      if (isDuplicateKeyError(error) && error.code === 11000) {
        return NextResponse.json(
          { message: "You already contacted this HR" },
          { status: 200 }
        );
      }

      console.error("Contact creation error", error);
      return NextResponse.json(
        { message: "Unable to create contact" },
        { status: 500 }
      );
    }
  },
  { roles: ["client"] }
);

export const GET = withAuth(async (_request, { user }) => {
  await ensureDbConnected();

  if (user.role === "client") {
    const contacts = await ContactModel.find({ client: user._id })
      .populate([
        { path: "client", select: "-password" },
        { path: "hr", select: "-password" },
      ])
      .sort({ createdAt: -1 })
      .lean({ getters: true });

    return NextResponse.json({
      contacts: contacts
        .map(safeSerialize)
        .filter((record): record is ContactRecord => Boolean(record)),
    });
  }

  if (user.role === "hr") {
    const contacts = await ContactModel.find({ hr: user._id })
      .populate([
        { path: "client", select: "-password" },
        { path: "hr", select: "-password" },
      ])
      .sort({ createdAt: -1 })
      .lean({ getters: true });

    return NextResponse.json({
      contacts: contacts
        .map(safeSerialize)
        .filter((record): record is ContactRecord => Boolean(record)),
    });
  }

  const contacts = await ContactModel.find()
    .populate([
      { path: "client", select: "-password" },
      { path: "hr", select: "-password" },
    ])
    .sort({ createdAt: -1 })
    .lean({ getters: true });

  return NextResponse.json({
    contacts: contacts
      .map(safeSerialize)
      .filter((record): record is ContactRecord => Boolean(record)),
  });
});


