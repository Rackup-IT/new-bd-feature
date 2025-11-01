import { NextRequest, NextResponse } from "next/server";

import { createNewAuthorAction } from "@/features/admin-panel/actions/author_action";
import { ApiError } from "../../../../lib/error";

// Simple in-memory rate limiter for demo purposes
const rateLimitStore = new Map<
  string,
  { count: number; lastRequest: number }
>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000; // 5 minutes
  const maxRequests = 3;

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, lastRequest: now });
    return true;
  }

  const record = rateLimitStore.get(ip)!;

  // Reset count if outside the window
  if (now - record.lastRequest > windowMs) {
    record.count = 1;
    record.lastRequest = now;
    return true;
  }

  // Increment count and check if over limit
  record.count++;
  record.lastRequest = now;

  if (record.count > maxRequests) {
    return false;
  }

  return true;
}

import {
  getAuthorsAction,
  logInAuthorAction,
} from "@/features/admin-panel/actions/author_action";
import { createSession, getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");
  const password = searchParams.get("password");
  const status = searchParams.get("status");

  // Use a simple identifier for rate limiting
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    request.nextUrl.hostname ||
    "unknown";

  // Check rate limit for login attempts
  if (email && password && !checkRateLimit(ip)) {
    return NextResponse.json(
      {
        message: "Too many login attempts. Please try again in 5 minutes.",
      },
      { status: 429 }
    );
  }

  // Handle login if email and password are provided
  if (email && password) {
    try {
      const user = await logInAuthorAction(email, password);
      await createSession({
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        isApproved: user.isApproved,
        approvalStatus: user.approvalStatus,
        isRootUser: user.isRootUser,
      });
      return NextResponse.json(
        { message: "Successfully logged in", redirectTo: "/dashboard" },
        { status: 200 }
      );
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { message: error.message, payload: error.payload },
          { status: error.statusCode }
        );
      }
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
  }
  // Handle fetching authors if no email/password provided
  else {
    try {
      const session = await getSession();
      if (!session?.isRootUser) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
      }
      const authors = await getAuthorsAction(
        status ? { approvalStatus: status } : undefined
      );
      return NextResponse.json(authors, { status: 200 });
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { message: error.message, payload: error.payload },
          { status: error.statusCode }
        );
      }
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }
  }
}

export async function POST(request: NextRequest) {
  // Use a simple identifier for rate limiting
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    request.nextUrl.hostname ||
    "unknown";

  // Check rate limit
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      {
        message:
          "Too many registration attempts. Please try again in 5 minutes.",
      },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const result = await createNewAuthorAction(formData);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message, payload: error.payload },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
