import { z } from "zod";

import { ApiError } from "@/lib/error";
import { NextRequest, NextResponse } from "next/server";
import {
  createPostAction,
  getAllPostAction,
} from "../../../../features/admin-panel/actions/blog_actions";

export async function GET() {
  try {
    const result = await getAllPostAction();
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

export async function POST(req: NextRequest) {
  try {
    const postType = req.nextUrl.searchParams.get("type");
    if (postType !== "draft" && postType !== "published") {
      throw new ApiError(
        404,
        "Please include a valid post type - draft/published"
      );
    }

    const form = await req.formData();
    const result = await createPostAction(form);

    return NextResponse.json(
      { message: `Success! Post created with id: ${result.insertedId}` },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message, payload: error.payload },
        { status: error.statusCode }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.message, payload: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Somethiing inerally went wrong" },
      { status: 500 }
    );
  }
}
