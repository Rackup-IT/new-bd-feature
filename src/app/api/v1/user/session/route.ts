import { getUserSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getUserSession();
  return NextResponse.json({ session });
}
