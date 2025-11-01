import { EJSON } from "bson";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/mongodb";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

function createAttachmentResponse(data: string, fileName: string) {
  return new NextResponse(data, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.isRootUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const db = await getDb();

    const collections = await db
      .listCollections({}, { nameOnly: true })
      .toArray();

    if (!collections.length) {
      return NextResponse.json(
        { message: "No collections found" },
        { status: 404 }
      );
    }

    const backupPayload: Record<string, unknown[]> = {};

    for (const collection of collections) {
      const name = collection.name;

      if (!name || name.startsWith("system.")) {
        continue;
      }

      const documents = await db.collection(name).find({}).toArray();

      backupPayload[name] = documents.map((doc) =>
        EJSON.serialize(doc, { relaxed: true })
      );
    }

    const backupJson = JSON.stringify(backupPayload, null, 2);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `mongodb-backup-${timestamp}.json`;

    return createAttachmentResponse(backupJson, fileName);
  } catch (error) {
    console.error("Backup export failed", error);
    return NextResponse.json(
      { message: "Failed to export backup" },
      { status: 500 }
    );
  }
}
