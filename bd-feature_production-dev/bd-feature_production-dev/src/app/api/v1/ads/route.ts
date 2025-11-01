import { MongoClient, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const uri = process.env.MONGODB_URI as string;

// GET - List all ads
export async function GET(request: NextRequest) {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db("bd-feature");
        const adsCollection = database.collection("ads");

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "all";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        // Build filter
        const filter: Record<string, string> = {};
        if (status === "active") {
            filter.status = "active";
        } else if (status === "inactive") {
            filter.status = "inactive";
        }

        // Get ads with pagination
        const ads = await adsCollection
            .find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        // Get total count
        const total = await adsCollection.countDocuments(filter);

        // Get stats
        const activeCount = await adsCollection.countDocuments({ status: "active" });
        const inactiveCount = await adsCollection.countDocuments({ status: "inactive" });

        return NextResponse.json({
            ads,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
            stats: {
                active: activeCount,
                inactive: inactiveCount,
                total: activeCount + inactiveCount,
            },
        });
    } catch (error) {
        console.error("Error fetching ads:", error);
        return NextResponse.json(
            { message: "Failed to fetch ads" },
            { status: 500 }
        );
    } finally {
        await client.close();
    }
}

// POST - Create new ad
export async function POST(request: NextRequest) {
    const client = new MongoClient(uri);

    try {
        const body = await request.json();
        const { title, imageUrl, link, position, status } = body;

        // Validate required fields
        if (!title || !imageUrl) {
            return NextResponse.json(
                { message: "Title and image are required" },
                { status: 400 }
            );
        }

        await client.connect();
        const database = client.db("bd-feature");
        const adsCollection = database.collection("ads");

        const newAd = {
            title,
            imageUrl,
            link: link || "",
            position: position || "sidebar",
            status: status || "active",
            clicks: 0,
            impressions: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await adsCollection.insertOne(newAd);

        return NextResponse.json({
            message: "Ad created successfully",
            ad: { _id: result.insertedId, ...newAd },
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating ad:", error);
        return NextResponse.json(
            { message: "Failed to create ad" },
            { status: 500 }
        );
    } finally {
        await client.close();
    }
}

// PUT - Update ad
export async function PUT(request: NextRequest) {
    const client = new MongoClient(uri);

    try {
        const body = await request.json();
        const { _id, title, imageUrl, link, position, status } = body;

        if (!_id) {
            return NextResponse.json(
                { message: "Ad ID is required" },
                { status: 400 }
            );
        }

        await client.connect();
        const database = client.db("bd-feature");
        const adsCollection = database.collection("ads");

        const updateData: Record<string, Date | string> = {
            updatedAt: new Date(),
        };

        if (title) updateData.title = title;
        if (imageUrl) updateData.imageUrl = imageUrl;
        if (link !== undefined) updateData.link = link;
        if (position) updateData.position = position;
        if (status) updateData.status = status;

        const result = await adsCollection.updateOne(
            { _id: new ObjectId(_id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { message: "Ad not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Ad updated successfully",
        });
    } catch (error) {
        console.error("Error updating ad:", error);
        return NextResponse.json(
            { message: "Failed to update ad" },
            { status: 500 }
        );
    } finally {
        await client.close();
    }
}

// DELETE - Delete ad
export async function DELETE(request: NextRequest) {
    const client = new MongoClient(uri);

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "Ad ID is required" },
                { status: 400 }
            );
        }

        await client.connect();
        const database = client.db("bd-feature");
        const adsCollection = database.collection("ads");

        const result = await adsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { message: "Ad not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Ad deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting ad:", error);
        return NextResponse.json(
            { message: "Failed to delete ad" },
            { status: 500 }
        );
    } finally {
        await client.close();
    }
}
