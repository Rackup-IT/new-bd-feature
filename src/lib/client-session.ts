"use client";

import { useEffect, useState } from "react";

interface SessionData {
  userId: string;
  email: string;
  name: string;
  isApproved?: boolean;
  approvalStatus?: "pending" | "approved" | "rejected";
  isRootUser?: boolean;
}

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("session="))
      ?.split("=")[1];

    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(decodeURIComponent(sessionCookie));
        setSession(sessionData);
      } catch (error) {
        console.error("Error parsing session cookie:", error);
      }
    }
    setLoading(false);
  }, []);

  return { session, loading };
}
