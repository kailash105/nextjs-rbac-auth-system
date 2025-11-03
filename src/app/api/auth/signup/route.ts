import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureDbConnected } from "@/lib/db";
import UserModel from "@/models/User";
import { sanitizeUser, setAuthCookie, signToken } from "@/lib/auth";

const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["client", "hr", "admin"]),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid data", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, name, password, role } = parsed.data;

  try {
    await ensureDbConnected();

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    const user = await UserModel.create({ name, email, password, role });

    const token = signToken({
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setAuthCookie(token);

    return NextResponse.json(
      {
        user: sanitizeUser({
          ...user.toObject(),
          _id: user._id.toString(),
        }),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error", error);
    return NextResponse.json(
      { message: "Unable to create account" },
      { status: 500 }
    );
  }
}


