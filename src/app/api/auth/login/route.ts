import { NextResponse } from "next/server";
import { z } from "zod";
import { ensureDbConnected } from "@/lib/db";
import UserModel from "@/models/User";
import { sanitizeUser, setAuthCookie, signToken } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid credentials", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  try {
    await ensureDbConnected();
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = signToken({
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      user: sanitizeUser({
        ...user.toObject(),
        _id: user._id.toString(),
      }),
    });
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json(
      { message: "Unable to login" },
      { status: 500 }
    );
  }
}


