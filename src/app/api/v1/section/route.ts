import { NextRequest, NextResponse } from "next/server";

import { ApiError } from "@/lib/error";
import {
  addSectionAction,
  deleteSectionAction,
  getAllSectionsAction,
  updateSectionAction,
} from "../../../../features/admin-panel/actions/section_actions";

export async function GET() {
  try {
    const result = await getAllSectionsAction();
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
    const form = await req.formData();
    await addSectionAction(form);
    return NextResponse.json(
      { message: "Section added to database" },
      { status: 201 }
    );
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

export async function DELETE(req: NextRequest) {
  try {
    const sectionId = req.nextUrl.searchParams.get("sectionId");
    await deleteSectionAction(sectionId as string);
    return NextResponse.json({ message: "Section deleted" }, { status: 200 });
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

export async function PUT(req: NextRequest) {
  try {
    const sectionId = req.nextUrl.searchParams.get("sectionId");
    const form = await req.formData();
    await updateSectionAction(sectionId as string, form);
    return NextResponse.json(
      { message: "Section is updated" },
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
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
