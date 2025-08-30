import { getSession } from "@/lib/session";
import Link from "next/link";

export default async function PendingApprovalPage() {
  const session = await getSession();

  if (!session || session.isApproved) {
    // If user is approved or not logged in, redirect to dashboard
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
          <p>You will be redirected to the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Pending Approval
        </h1>

        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            Your request to become an author is currently under review.
          </p>
          <p className="text-gray-700">
            You will receive an email notification once your request has been
            processed.
          </p>
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Status:{" "}
            <span className="font-medium capitalize">
              {session.approvalStatus}
            </span>
          </p>

          {session.approvalStatus === "rejected" && session.approvalNotes && (
            <div className="mt-4 p-3 bg-red-50 rounded-md">
              <p className="text-red-700 text-sm">
                Reason: {session.approvalNotes}
              </p>
            </div>
          )}

          <div className="mt-6">
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
