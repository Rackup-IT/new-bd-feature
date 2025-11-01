import { destroySession } from '@/lib/session';
import { NextResponse } from 'next/server';

export async function POST() {
  // Destroy the author/admin session (cookie named "session")
  await destroySession();
  return NextResponse.json({ ok: true });
}
