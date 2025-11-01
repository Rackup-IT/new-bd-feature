import { getDb } from "@/lib/mongodb";
import { createUserSession } from "@/lib/session";
import { NextResponse } from "next/server";

// This is a minimal placeholder endpoint for social auth callbacks.
// In a real implementation you'd integrate with OAuth providers and validate tokens.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { provider, email, name } = body;
    if (!provider || !email || !name) {
      return NextResponse.json(
        { error: "Missing social auth data" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const users = db.collection("users");

    let user = await users.findOne({ email: email.toLowerCase() });
    if (!user) {
      const now = new Date();
      const insertRes = await users.insertOne({
        email: email.toLowerCase(),
        name,
        provider,
        createdAt: now,
        updatedAt: now,
      });
      user = await users.findOne({ _id: insertRes.insertedId });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create or find user" },
        { status: 500 }
      );
    }

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
