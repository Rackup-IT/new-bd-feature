import { getDb } from "@/lib/mongodb";
import { Document, Filter } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

type SearchResultDoc = {
    _id: string;
    title: string;
    desscription?: string;
    image?: string;
    slug: string;
    createdAt?: string | Date;
    edition?: string;
    keywords?: string | string[];
    section?: string;
    writter?: {
        name?: string;
        email?: string;
    } | null;
};

type TopicSummary = {
    name: string;
    count: number;
    image?: string;
    slug?: string;
};

const isLikelySlug = (value: string) => /^[0-9a-f]{24}$/i.test(value);

const shouldIncludeTopic = (name: string) => {
    if (!name) return false;
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (trimmed.length < 3) return false;
    if (isLikelySlug(trimmed)) return false;
    if (/^https?:/i.test(trimmed)) return false;
    return true;
};

const addTopicToMap = (
    map: Map<string, TopicSummary>,
    rawName: string | undefined,
    result: SearchResultDoc
) => {
    if (!rawName) return;
    const trimmed = rawName.trim();
    if (!shouldIncludeTopic(trimmed)) return;
    const key = trimmed.toLowerCase();
    const existing = map.get(key);
    if (existing) {
        existing.count += 1;
        if (!existing.image && result.image) {
            existing.image = result.image;
        }
        if (!existing.slug && result.slug) {
            existing.slug = result.slug;
        }
        return;
    }

    map.set(key, {
        name: trimmed,
        count: 1,
        image: result.image,
        slug: result.slug,
    });
};

const normalizeTopics = (results: SearchResultDoc[], query: string) => {
    const keywordTopics = new Map<string, TopicSummary>();
    const sectionTopics = new Map<string, TopicSummary>();
    const normalizedQuery = query.toLowerCase();

    results.forEach((result) => {
        const keywords = parseKeywords(result.keywords);
        keywords.forEach((keyword) => addTopicToMap(keywordTopics, keyword, result));
        addTopicToMap(sectionTopics, result.section, result);
    });

    const keywordTopicList = Array.from(keywordTopics.values()).sort(
        (a, b) => b.count - a.count
    );
    const sectionTopicList = Array.from(sectionTopics.values()).sort(
        (a, b) => b.count - a.count
    );

    const multiKeywordTopics = keywordTopicList.filter((topic) => topic.count > 1);
    const topicsPool =
        multiKeywordTopics.length > 0
            ? multiKeywordTopics
            : sectionTopicList.filter((topic) => topic.count > 1);

    const featuredCandidateSources =
        keywordTopicList.length > 0 ? keywordTopicList : sectionTopicList;

    const featuredTopic =
        featuredCandidateSources.find((topic) =>
            topic.name.toLowerCase().includes(normalizedQuery)
        ) || featuredCandidateSources[0] ||
        (results[0]
            ? {
                name: results[0].title,
                count: results.length,
                image: results[0].image,
                slug: results[0].slug,
            }
            : undefined);

    const relatedTopicsCandidate = topicsPool.length > 0 ? topicsPool : sectionTopicList;
    const relatedTopics = relatedTopicsCandidate
        .filter((topic) =>
            featuredTopic ? topic.name.toLowerCase() !== featuredTopic.name.toLowerCase() : true
        )
        .slice(0, 4);

    return { featuredTopic, relatedTopics };
};

const parseKeywords = (keywords: SearchResultDoc["keywords"]): string[] => {
    if (!keywords) return [];
    if (Array.isArray(keywords)) {
        return keywords.map((keyword) => `${keyword}`.trim()).filter(Boolean);
    }

    if (typeof keywords === "string") {
        const trimmed = keywords.trim();
        if (!trimmed) return [];

        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return parsed.map((keyword) => `${keyword}`.trim()).filter(Boolean);
            }
        } catch {
            // fall through to comma split
        }

        return trimmed
            .split(/[,|]/)
            .map((keyword) => keyword.trim())
            .filter(Boolean);
    }

    return [];
};

const LANGUAGE_ALIAS_MAP: Record<string, string[]> = {
    en: ["en", "eng", "english", "global", "international", "intl", "usa", "us"],
    bn: [
        "bn",
        "bengali",
        "bangla",
        "bangladesh",
        "বাংলা",
        "বাংলাদেশ",
        "bn-bd",
        "bd",
    ],
};

const normalizeEditionTokens = (value: string | undefined) => {
    if (!value) return [] as string[];
    return value
        .toString()
        .split(/[\s,/|_-]+/)
        .map((token) => token.trim().toLowerCase())
        .filter(Boolean);
};

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const query = (searchParams.get("q") || "").trim();
        const sortBy = searchParams.get("sort") || "newest";
        const language = searchParams.get("lang") || "all";
        const timeRange = searchParams.get("time") || "all";

        if (!query) {
            return NextResponse.json(
                { results: [], message: "No search query provided" },
                { status: 200 }
            );
        }

        const db = await getDb();

        // Build the search filter
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const tokens = escapedQuery
            .split(/\s+/)
            .map((token) => token.trim())
            .filter(Boolean);

        const tokenConditions: Filter<Document>[] = tokens.length
            ? tokens.map((token) => {
                const regex = new RegExp(token, "i");
                return {
                    $or: [
                        { title: { $regex: regex } },
                        { desscription: { $regex: regex } },
                        { content: { $regex: regex } },
                        { slug: { $regex: regex } },
                        { section: { $regex: regex } },
                        { keywords: { $regex: regex } },
                    ],
                } as Filter<Document>;
            })
            : [
                {
                    $or: [
                        { title: { $regex: new RegExp(escapedQuery, "i") } },
                        { desscription: { $regex: new RegExp(escapedQuery, "i") } },
                        { content: { $regex: new RegExp(escapedQuery, "i") } },
                        { slug: { $regex: new RegExp(escapedQuery, "i") } },
                        { section: { $regex: new RegExp(escapedQuery, "i") } },
                        { keywords: { $regex: new RegExp(escapedQuery, "i") } },
                    ],
                } as Filter<Document>,
            ];

        const statusCondition: Filter<Document> = {
            $or: [
                { status: { $regex: /^published$/i } },
                { status: { $exists: false } },
                { status: null },
            ],
        };

        const andConditions: Filter<Document>[] = [statusCondition, ...tokenConditions];
        const filter: Filter<Document> = {
            $and: andConditions,
        };

        const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        // Execute the search with aggregation to include writer information
        const results = (await db
            .collection("posts")
            .aggregate([
                { $match: filter },
                {
                    $addFields: {
                        convertedWriterId: { $toObjectId: "$writter" },
                    },
                },
                {
                    $lookup: {
                        from: "authors",
                        localField: "convertedWriterId",
                        foreignField: "_id",
                        as: "writterData",
                    },
                },
                {
                    $unwind: {
                        path: "$writterData",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        desscription: 1,
                        image: 1,
                        slug: 1,
                        createdAt: 1,
                        edition: 1,
                        section: 1,
                        keywords: 1,
                        writter: {
                            name: "$writterData.name",
                            email: "$writterData.email",
                        },
                    },
                },
                { $limit: 50 }, // Limit results to 50
            ])
            .toArray()) as SearchResultDoc[];

        const searchTokens = query
            .toLowerCase()
            .split(/\s+/)
            .map((token) => token.trim())
            .filter(Boolean);

        const toDate = (value: string | Date | undefined) => {
            if (!value) return null;
            if (value instanceof Date) {
                return Number.isNaN(value.getTime()) ? null : value;
            }
            const computed = new Date(value);
            return Number.isNaN(computed.getTime()) ? null : computed;
        };

        const normalizedLanguage = language.toLowerCase();
        const languageAliases = LANGUAGE_ALIAS_MAP[normalizedLanguage] ?? [];

        const now = new Date();
        let startDate: Date | null = null;
        switch (timeRange) {
            case "week":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "month":
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case "year":
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = null;
        }

        const matchesLanguage = (result: SearchResultDoc) => {
            if (normalizedLanguage === "all") return true;
            if (languageAliases.length === 0) return true;

            const editionTokens = normalizeEditionTokens(result.edition);
            if (editionTokens.length === 0) {
                // Default to English when edition is missing, since English is primary content language
                return normalizedLanguage === "en";
            }

            return editionTokens.some((token) => languageAliases.includes(token));
        };

        const matchesTimeRange = (result: SearchResultDoc) => {
            if (!startDate) return true;
            const createdAtDate = toDate(result.createdAt);
            if (!createdAtDate) return false;
            return createdAtDate >= startDate;
        };

        const computeRelevanceScore = (result: SearchResultDoc) => {
            if (searchTokens.length === 0) return 0;
            const contentParts: string[] = [
                result.title,
                result.desscription,
                result.section,
                Array.isArray(result.keywords)
                    ? result.keywords.join(" ")
                    : typeof result.keywords === "string"
                        ? result.keywords
                        : "",
                result.slug,
            ]
                .filter(Boolean)
                .map((part) => part!.toString().toLowerCase());

            if (contentParts.length === 0) return 0;

            const combined = contentParts.join(" ");
            return searchTokens.reduce((score, token) => {
                const safeToken = escapeRegExp(token);
                if (!safeToken) return score;
                const regex = new RegExp(`\\b${safeToken}`, "gi");
                const matches = combined.match(regex);
                return score + (matches ? matches.length : 0);
            }, 0);
        };

        const filteredResults = results.filter(
            (result) => matchesLanguage(result) && matchesTimeRange(result)
        );

        const sortedResults = [...filteredResults].sort((a, b) => {
            if (sortBy === "newest") {
                const dateA = toDate(a.createdAt) ?? new Date(0);
                const dateB = toDate(b.createdAt) ?? new Date(0);
                return dateB.getTime() - dateA.getTime();
            }

            const scoreA = computeRelevanceScore(a);
            const scoreB = computeRelevanceScore(b);
            if (scoreB !== scoreA) {
                return scoreB - scoreA;
            }

            const dateA = toDate(a.createdAt) ?? new Date(0);
            const dateB = toDate(b.createdAt) ?? new Date(0);
            return dateB.getTime() - dateA.getTime();
        });

        const { featuredTopic, relatedTopics } = normalizeTopics(sortedResults, query);

        return NextResponse.json(
            {
                results: sortedResults,
                count: sortedResults.length,
                query,
                featuredTopic,
                relatedTopics,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            { message: "Internal server error", results: [] },
            { status: 500 }
        );
    }
}
