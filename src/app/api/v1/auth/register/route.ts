import { getDb } from "@/lib/mongodb";
import { createUserSession } from "@/lib/session";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, fullName, jobTitle } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const users = db.collection("users");

    const existing = await users.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const now = new Date();
    const insertRes = await users.insertOne({
      email: email.toLowerCase(),
      password: hashed,
      name: fullName,
      jobTitle: jobTitle || null,
      createdAt: now,
      updatedAt: now,
    });

    const user = await users.findOne({ _id: insertRes.insertedId });

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // create session cookie
    await createUserSession({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({
      ok: true,
      user: { id: user._id.toString(), email: user.email, name: user.name },
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message || "Server error" },
      { status: 500 }
    );
  }
}
