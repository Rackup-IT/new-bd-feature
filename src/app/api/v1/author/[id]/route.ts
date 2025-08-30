import { NextRequest, NextResponse } from "next/server";
import { getAuthorByIdAction } from "../../../../../features/admin-panel/actions/author_action";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const author = await getAuthorByIdAction(id);
    return NextResponse.json(author);
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

import { updateAuthorAction } from "../../../../../features/admin-panel/actions/author_action";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Try to parse as JSON first, fall back to FormData
    let data;
    try {
      data = await req.json();
    } catch {
      data = await req.formData();
    }
    const author = await updateAuthorAction(id, data);
    return NextResponse.json(author);
  } catch (error) {
    console.error("Error updating author:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
