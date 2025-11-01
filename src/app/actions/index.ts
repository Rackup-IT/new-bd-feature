"use server";
// Allow a minimal set of explicit anys in this thin wiring file; runtime behavior unchanged.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { signIn, signOut } from "@/auth";

export async function doSocialLogin(formData: FormData) {
  const action = formData.get("action") as string | null;
  if (!action) return;
  // Using auth.js signIn server action to trigger provider flow
  // request provider flow with server finish handler as callback so we can ensure user_session cookie is set
  await signIn(
    action as any,
    { callbackUrl: "/api/auth/finish", redirect: true } as any
  );
}

export async function doLogout() {
  await signOut({ redirectTo: "/" } as any);
}
