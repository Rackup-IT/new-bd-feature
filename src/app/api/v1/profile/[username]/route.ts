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
            let query: { _id: ObjectId } | { $or: Array<{ username: string } | { email: string }> };
            if (ObjectId.isValid(username) && username.length === 24) {
                query = { _id: new ObjectId(username) };
            } else {
                query = {
                    $or: [
                        { username: username },
                        { email: username }
                    ]
                };
            }

            const author = await db.collection("authors").findOne(query, {
                projection: { password: 0 } // Exclude password
            });

            if (author) {
                // Count articles by this author
                const articlesCount = await db.collection("posts").countDocuments({
                    writter: author._id.toString()
                });

                // Transform author data to profile format
                const profile = {
                    _id: author._id.toString(),
                    name: author.name || "Unknown Author",
                    image: author.profileImage || undefined,
                    title: author.occupation || "Author",
                    institution: author.location || "BD-Feature",
                    institutionSlug: undefined,
                    bio: author.bio || "No bio available.",
                    articlesCount: articlesCount,
                    commentsCount: 0, // TODO: Implement comments
                    experience: author.experience || [],
                    contactFor: author.contactFor || [
                        "General",
                        "Media request",
                        "Speaking request"
                    ],
                    location: author.location,
                    orcid: author.orcid,
                    website: author.website,
                    joinedDate: author.createdAt || author.requestedAt,
                };

                return NextResponse.json(profile);
            }
        } catch (dbError) {
            console.error("Database error:", dbError);
            // Fall through to mock data
        }

        // Mock data fallback for development
        const mockProfile = {
            _id: "1",
            name: "Asher Kaufman",
            image: "/api/placeholder/150/150",
            title: "Professor of History and Peace Studies",
            institution: "University of Notre Dame",
            institutionSlug: "university-of-notre-dame",
            bio: `Asher Kaufman is professor of history and peace studies and a core faculty member. His region of expertise is the modern Middle East with a particular focus on Lebanon, Israel, and Syria. His research interests include the history and legacy of nationalism and colonialism in the Middle East, border conflicts and dynamics, and the interplay between memory, history, and violence.

Kaufman's current project examines the 1982 Israeli invasion of Lebanon and the consequent 18-year occupation of South Lebanon from 1982 to 2000. In this project he studies questions of memory, forgetfulness, and silence within Israeli, Lebanese and Palestinian societies. He also explores border dynamics between Lebanon and Israel and investigates Israel's occupation of South Lebanon, comparing it with the country's occupation of the Occupied Palestinian Territories.

He received a Ph.D. from Brandeis University in 2000.

Kaufman is the author of Contested Frontiers: Cartography, Sovereignty, and Conflict (Woodrow Wilson Center,with Johns Hopkins). He also is the author of Reviving Phoenicia: The Search for Identity in Lebanon (I.B. Tauris), a history of modern Lebanese national identity.

Among Kaufman's recent publications are "Belonging and Continuity: Israeli Druze and Lebanon, 1982-2000," International Journal of Middle East Studies 48 (2016), 1–20; "Thinking Beyond Direct Violence," International Journal of Middle East Studies (May 2014), pp. 441-444; "Colonial Cartography and the Making of Palestine, Lebanon and Syria," in Cyrus Schayegh and Andrew Arsan (eds.), The Routledge Handbook of the History of Middle East Mandates (London: Routledge, 2015). "Between Permeable and Sealed Borders: The Trans-Arabian Pipeline and the Arab-Israeli Conflict," International Journal of Middle East Studies (February 2014), pp. 95-116; Forgetting the Lebanon War? On Silence, Denial and Selective Remembrance of the 'First' Lebanon War," in Shadows of War: A Social History of Silence in the Twentieth Century, edited by Efrat Ben Ze'ev, Ruth Ginio and Jay Winter (Cambridge University Press, 2010).`,
            articlesCount: 16,
            commentsCount: 0,
            experience: [
                {
                    period: "–present",
                    title: "Professor of History and Peace Studies",
                    organization: "University of Notre Dame",
                },
            ],
            contactFor: [
                "General",
                "Media request",
                "Speaking request",
                "Consulting / Advising",
                "Research collaboration",
                "Research supervision",
            ],
            location: "Notre Dame, Indiana, U.S.",
            orcid: "0000-0001-9769-005X",
            joinedDate: "2023-10-17T00:00:00.000Z",
        };

        // In production, fetch from database:
        // const profile = await db.collection("users").findOne({ username });
        // if (!profile) {
        //     return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        // }

        return NextResponse.json(mockProfile);
    } catch (error) {
        console.error("Profile API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
