import { cookies } from "next/headers";

interface SessionData {
  userId: string;
  email: string;
  name: string;
  isApproved?: boolean;
  approvalStatus?: "pending" | "approved" | "rejected";
  approvalNotes?: string;
  isRootUser?: boolean;
}

export async function createSession(user: {
  _id: string;
  email: string;
  name: string;
  isApproved?: boolean;
  approvalStatus?: "pending" | "approved" | "rejected";
  isRootUser?: boolean;
}) {
  const sessionData: SessionData = {
    email: user.email,
    name: user.name,
    userId: user._id,
    isApproved: user.isApproved,
    approvalStatus: user.approvalStatus,
    isRootUser: user.isRootUser,
  };

  const cookieStore = await cookies();
  cookieStore.set("session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    return null;
  }

  try {
    const sessionData: SessionData = JSON.parse(sessionCookie.value);
    return sessionData;
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

// User-specific session helpers (isolated from admin/session)
export async function createUserSession(user: {
  _id: string;
  email: string;
  name: string;
  isApproved?: boolean;
  approvalStatus?: "pending" | "approved" | "rejected";
  isRootUser?: boolean;
}) {
  const sessionData = {
    email: user.email,
    name: user.name,
    userId: user._id,
    isApproved: user.isApproved,
    approvalStatus: user.approvalStatus,
    isRootUser: user.isRootUser,
  };

  const cookieStore = await cookies();
  cookieStore.set("user_session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getUserSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user_session");
  if (!sessionCookie) return null;
  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

export async function destroyUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete("user_session");
}
