import { auth } from "@/auth";
import { getDb } from "@/lib/mongodb";
import { createUserSession } from "@/lib/session";
import { NextResponse } from "next/server";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET(req: Request) {
  try {
    const userSession = await auth();

    if (!userSession || !userSession.user || !userSession.user.email) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const email = (userSession.user.email || "").toLowerCase();
    const name =
      userSession.user.name || userSession.user?.email?.split("@")[0] || "";

    const db = await getDb();
    const users = db.collection("users");

    const now = new Date();
    const update = {
      $set: {
        email,
        name,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    } as any;

    const res = await users.findOneAndUpdate({ email }, update, {
      upsert: true,
      returnDocument: "after",
    });
    const dbUser = res && (res as any).value;

    if (dbUser) {
      await createUserSession({
        _id: dbUser._id.toString(),
        email: dbUser.email,
        name: dbUser.name,
        isApproved: dbUser.isApproved,
        approvalStatus: dbUser.approvalStatus,
        isRootUser: dbUser.isRootUser,
      });
    }

    return NextResponse.redirect(new URL("/", req.url));
  } catch {
    // preserve behavior: redirect to home on any error
    return NextResponse.redirect(new URL("/", req.url));
  }
}
