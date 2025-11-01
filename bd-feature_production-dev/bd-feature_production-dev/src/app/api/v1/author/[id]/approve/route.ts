import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // In a real implementation, we would check if the user is an admin
  // For now, we'll assume the root user email is stored in environment variables
  const rootUserEmail = process.env.ROOT_USER_EMAIL;
  if (!rootUserEmail || session.email !== rootUserEmail) {
    return NextResponse.json(
      { error: "Forbidden - Admin access required" },
      { status: 403 }
    );
  }
  const { action, notes } = await request.json();

  if (!["approved", "rejected"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const updateData: {
      approvalStatus: string;
      approvedById: string;
      requestedAt: Date;
      isApproved?: boolean;
      approvalNotes?: string;
    } = {
      approvalStatus: action,
      approvedById: session.userId,
      requestedAt: new Date(),
    };

    if (action === "approved") {
      updateData.isApproved = true;
    } else {
      updateData.isApproved = false;
      updateData.approvalNotes = notes || "Request rejected by admin";
    }

    // Update the user's approval status
    const result = await db
      .collection("authors")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "User not found or no changes made" },
        { status: 404 }
      );
    }

    // If rejecting, invalidate any existing sessions
    if (action === "rejected") {
      // In a real implementation, we would delete sessions from the database
      // For now, we'll just note that sessions should be invalidated
      console.log(
        `User ${id} was rejected. Any existing sessions should be invalidated.`
      );
    }

    return NextResponse.json({
      success: true,
      message: `User ${action} successfully`,
    });
  } catch (error) {
    console.error("Error updating approval status:", error);
    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 }
    );
  }
}
