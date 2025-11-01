import { useQuery } from "@tanstack/react-query";

interface SessionData {
  userId: string;
  email: string;
  name: string;
  isApproved?: boolean;
  approvalStatus?: "pending" | "approved" | "rejected";
  isRootUser?: boolean;
}

interface SessionResponse {
  session: SessionData | null;
}

const fetchSession = async (): Promise<SessionResponse> => {
  const response = await fetch("/api/v1/session");
  if (!response.ok) {
    throw new Error("Failed to fetch session");
  }
  return response.json();
};

export const useSessionQuery = () => {
  return useQuery<SessionResponse, Error>({
    queryKey: ["session"],
    queryFn: fetchSession,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
