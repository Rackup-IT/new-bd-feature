import { NextRequest, NextResponse } from "next/server";

import { ApiError } from "@/lib/error";
import {
  deletePostAction,
  getPostById,
  updatePostAction,
} from "../../../../../features/admin-panel/actions/blog_actions";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const withWriterData = req.nextUrl.searchParams.get("writter-data");
    const { slug } = await params;
    const result = await getPostById(slug, withWriterData || "false");
    return NextResponse.json(result, { status: 200 });
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json(); // Parse JSON body
    console.log("WENT HERE NOW");
    await updatePostAction(slug, body); // Pass body directly
    return NextResponse.json({ message: "Success" }, { status: 200 });
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await deletePostAction(slug);
    return NextResponse.json({ message: "Success" }, { status: 200 });
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
