import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, name, language } = body;

        // Validate input
        if (!email || !name) {
            return NextResponse.json(
                { message: "Email and name are required" },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Invalid email address" },
                { status: 400 }
            );
        }

        const db = await getDb();

        // Check if email already exists
        const existingSubscriber = await db
            .collection("newsletter_subscribers")
            .findOne({ email: email.toLowerCase() });

        if (existingSubscriber) {
            return NextResponse.json(
                { message: "This email is already subscribed to our newsletter" },
                { status: 409 }
            );
        }

        // Create new subscriber
        const subscriber = {
            email: email.toLowerCase(),
            name: name.trim(),
            language: language || "en",
            subscribedAt: new Date(),
            status: "active",
            source: "website",
        };

        await db.collection("newsletter_subscribers").insertOne(subscriber);

        return NextResponse.json(
            { 
                message: "Successfully subscribed to newsletter",
                subscriber: {
                    email: subscriber.email,
                    name: subscriber.name,
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        const db = await getDb();

        const result = await db
            .collection("newsletter_subscribers")
            .updateOne(
                { email: email.toLowerCase() },
                { 
                    $set: { 
                        status: "unsubscribed",
                        unsubscribedAt: new Date()
                    }
                }
            );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { message: "Email not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Successfully unsubscribed from newsletter" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Newsletter unsubscribe error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
