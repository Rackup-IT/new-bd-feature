import { MongoClient, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const uri = process.env.MONGODB_URI as string;

// POST - Track ad impression or click
export async function POST(request: NextRequest) {
    const client = new MongoClient(uri);

    try {
        const body = await request.json();
        const { adId, type } = body; // type: 'impression' or 'click'

        if (!adId || !type) {
            return NextResponse.json(
                { message: "Ad ID and type are required" },
                { status: 400 }
            );
        }

        await client.connect();
        const database = client.db("bd-feature");
        const adsCollection = database.collection("ads");

        const updateField = type === "impression" ? "impressions" : "clicks";

        await adsCollection.updateOne(
            { _id: new ObjectId(adId) },
            { $inc: { [updateField]: 1 } }
        );

        return NextResponse.json({
            message: "Tracked successfully",
        });
    } catch (error) {
        console.error("Error tracking ad:", error);
        return NextResponse.json(
            { message: "Failed to track" },
            { status: 500 }
        );
    } finally {
        await client.close();
    }
}
