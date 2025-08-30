import { NextRequest, NextResponse } from "next/server";

import { ApiError } from "@/lib/error";
import {
  getSinglePageAction,
  uploadPageToDBAction,
} from "../../../../features/admin-panel/actions/page_actions";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const edition = searchParams.get("edition");
    const navLink = searchParams.get("navLink");
    const result = await getSinglePageAction(
      edition as string,
      navLink as string
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof ApiError)
      return NextResponse.json(
        { message: error.message, payload: error.payload },
        { status: error.statusCode }
      );
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await uploadPageToDBAction(data);
    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    if (error instanceof ApiError)
      return NextResponse.json(
        { message: error.message, payload: error.payload },
        { status: error.statusCode }
      );
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
