// app/api/session/route.ts
import { getSession } from "@/lib/session"; // Import your existing getSession function
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ session: null });
  }

  return NextResponse.json({ session });
}
