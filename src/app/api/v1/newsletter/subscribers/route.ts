import { getDb } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "active";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");
        const skip = (page - 1) * limit;

        const db = await getDb();

        // Build query
        const query: Record<string, string> = {};
        if (status !== "all") {
            query.status = status;
        }

        // Get subscribers
        const subscribers = await db
            .collection("newsletter_subscribers")
            .find(query)
            .sort({ subscribedAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();

        // Get total count
        const totalCount = await db
            .collection("newsletter_subscribers")
            .countDocuments(query);

        // Get stats
        const stats = await db
            .collection("newsletter_subscribers")
            .aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ])
            .toArray();

        const statsMap = stats.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {} as Record<string, number>);

        return NextResponse.json({
            subscribers,
            pagination: {
                page,
                limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
            stats: {
                active: statsMap.active || 0,
                unsubscribed: statsMap.unsubscribed || 0,
                total: stats.reduce((sum, item) => sum + item.count, 0),
            }
        });
    } catch (error) {
        console.error("Newsletter subscribers fetch error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
