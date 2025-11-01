import { destroyUserSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST() {
  await destroyUserSession();
  return NextResponse.json({ ok: true });
}
