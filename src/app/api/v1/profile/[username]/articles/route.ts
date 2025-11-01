import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{
        username: string;
    }>;
}

export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { username } = await params;
        const searchParams = request.nextUrl.searchParams;
        console.log(searchParams);
        // Try to fetch from database
        try {
            const db = await getDb();

            // Check if username is an ObjectId or actual username
            let authorQuery: { _id: ObjectId } | { $or: Array<{ username: string } | { email: string }> };
            if (ObjectId.isValid(username) && username.length === 24) {
                authorQuery = { _id: new ObjectId(username) };
            } else {
                authorQuery = {
                    $or: [
                        { username: username },
                        { email: username }
                    ]
                };
            }

            // Find the author first
            const author = await db.collection("authors").findOne(authorQuery);

            if (author) {
                // Fetch articles by this author
                const articles = await db
                    .collection("posts")
                    .find({ writter: author._id.toString() })
                    .sort({ createdAt: -1 })
                    .limit(50)
                    .toArray();

                return NextResponse.json({
                    articles: articles,
                    count: articles.length
                });
            }
        } catch (dbError) {
            console.error("Database error:", dbError);
        }

        // Return empty array if not found
        return NextResponse.json({ articles: [], count: 0 });
    } catch (error) {
        console.error("Articles API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
