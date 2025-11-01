import { getDb } from "@/lib/mongodb";
import { createUserSession } from "@/lib/session";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const users = db.collection("users");

    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const match = await bcrypt.compare(password, user.password || "");
    if (!match) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    await createUserSession({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      isApproved: user.isApproved,
      approvalStatus: user.approvalStatus,
      isRootUser: user.isRootUser,
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
