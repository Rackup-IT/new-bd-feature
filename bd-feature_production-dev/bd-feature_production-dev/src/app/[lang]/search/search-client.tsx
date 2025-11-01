"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Dictionary } from "../dictionaries";

interface SearchResult {
    _id: string;
    title: string;
    desscription?: string;
    image?: string;
    slug: string;
    section?: string;
    keywords?: string | string[];
    writter?: {
        name?: string;
    } | null;
    createdAt?: string;
}

type SortBy = "newest" | "relevance";
type Language = "all" | "en" | "bn";
type TimeRange = "all" | "week" | "month" | "year";

interface TopicSummary {
    name: string;
    count: number;
    image?: string;
    slug?: string;
}

interface SearchPageClientProps {
    lang: string;
    dict: Dictionary;
}

export default function SearchPageClient({ lang, dict }: SearchPageClientProps) {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortBy>("relevance");
    const [language, setLanguage] = useState<Language>("all");
    const [timeRange, setTimeRange] = useState<TimeRange>("all");
    const [totalCount, setTotalCount] = useState(0);
    const [featuredTopic, setFeaturedTopic] = useState<TopicSummary | null>(null);
    const [relatedTopics, setRelatedTopics] = useState<TopicSummary[]>([]);

    const fetchSearchResults = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                q: query,
                sort: sortBy,
                lang: language,
                time: timeRange,
            });

            const response = await fetch(`/api/v1/search?${params}`);
            if (response.ok) {
                const data = await response.json();
                setResults(data.results || []);
                setTotalCount(data.count || 0);
                setFeaturedTopic(data.featuredTopic || null);
                setRelatedTopics(data.relatedTopics || []);
            }
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    }, [language, query, sortBy, timeRange]);

    useEffect(() => {
        if (query) {
            void fetchSearchResults();
        } else {
            setLoading(false);
        }
    }, [fetchSearchResults, query]);

    const formatDate = (dateString?: string) => {
        if (!dateString) {
            return dict.search["unknown-date"];
        }

        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) {
            return dict.search["unknown-date"];
        }

        return date.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const resultsLabel = useMemo(() => {
        if (!query || loading) return "";
        const countLabel = new Intl.NumberFormat().format(totalCount || results.length);
        return `${countLabel} ${totalCount === 1 ? dict.search.result : dict.search.results}`;
    }, [loading, query, results.length, totalCount, dict]);

    const buildTopicHref = (topic: TopicSummary) => {
        const topicQuery = encodeURIComponent(topic.name);
        return `/${lang}/search?q=${topicQuery}`;
    };

    const formatItemCount = (count: number) =>
        `${new Intl.NumberFormat().format(count)} ${count === 1 ? dict.search.item : dict.search.items}`;

    return (
        <div className="min-h-screen bg-white">
            {/* Main Content */}
            <div className="tc-container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Search Input Box */}
                <div className="mb-4 sm:mb-6">
                    <form className="mb-3 sm:mb-4" action={`/${lang}/search`} method="get">
                        <div className="relative w-full py-3 sm:py-4 px-4 sm:px-5 bg-white border border-gray-300 rounded">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <svg
                                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    name="q"
                                    defaultValue={query}
                                    placeholder={dict.search["search-main-placeholder"]}
                                    className="flex-1 text-base sm:text-lg font-bold text-gray-900 border-none outline-none bg-transparent"
                                />
                            </div>
                        </div>
                    </form>

                    {/* Filter Bar */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
                        {/* Sort By */}
                        <div className="flex items-center gap-1 min-w-0">
                            <span className="text-gray-800 whitespace-nowrap">{dict.search.sort}</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortBy)}
                                className="px-1 sm:px-2 py-1 bg-white border-none text-gray-900 cursor-pointer focus:outline-none text-sm"
                            >
                                <option value="relevance">{dict.search.relevance}</option>
                                <option value="newest">{dict.search.newest}</option>
                            </select>
                        </div>

                        {/* Language */}
                        <div className="flex items-center gap-1 min-w-0">
                            <span className="text-gray-800 whitespace-nowrap">{dict.search.language}</span>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as Language)}
                                className="px-1 sm:px-2 py-1 bg-white border-none text-gray-900 cursor-pointer focus:outline-none text-sm"
                            >
                                <option value="all">{dict.search.all}</option>
                                <option value="en">{dict.search.english}</option>
                                <option value="bn">{dict.search.bengali}</option>
                            </select>
                        </div>

                        {/* Time Range */}
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                            className="px-1 sm:px-2 py-1 bg-white border-none text-gray-900 cursor-pointer focus:outline-none text-sm"
                        >
                            <option value="all">{dict.search["all-time"]}</option>
                            <option value="week">{dict.search["past-week"]}</option>
                            <option value="month">{dict.search["past-month"]}</option>
                            <option value="year">{dict.search["past-year"]}</option>
                        </select>
                    </div>
                </div>

                {resultsLabel && (
                    <p className="mb-4 sm:mb-6 text-sm text-gray-600">
                        {resultsLabel} {dict.search["results-for"]} <span className="font-medium">{query}</span>
                    </p>
                )}

                {/* Results Layout */}
                {loading ? (
                    <div className="text-center py-16 sm:py-20">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-gray-900"></div>
                        <p className="mt-3 sm:mt-4 text-gray-600">{dict.search.searching}</p>
                    </div>
                ) : !query ? (
                    <div className="text-center py-16 sm:py-20">
                        <p className="text-lg sm:text-xl text-gray-600">{dict.search["enter-search-query"]}</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center py-16 sm:py-20">
                        <p className="text-lg sm:text-xl text-gray-600">
                            {dict.search["no-results-found"]} <span className="font-medium">&ldquo;{query}&rdquo;</span>
                        </p>
                        <p className="mt-2 text-gray-500">
                            {dict.search["try-different-keywords"]}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 sm:gap-8">
                        {/* Main Results Column */}
                        <div className="space-y-6 sm:space-y-8">
                            {results.map((result) => (
                                <article
                                    key={result._id}
                                    className="pb-4 sm:pb-6 border-b border-gray-200 last:border-b-0"
                                >
                                    <p className="text-xs text-gray-500 mb-2">
                                        {dict.search.published} {formatDate(result.createdAt)}
                                    </p>

                                    <Link
                                        href={`/${lang}/${result.slug}`}
                                        className="group"
                                    >
                                        <h3 className="text-lg sm:text-xl font-bold text-blue-600 mb-2 group-hover:underline leading-tight">
                                            {result.title}
                                        </h3>
                                    </Link>

                                    <p className="text-sm text-gray-700 mb-2">
                                        <span className="font-medium">{result.writter?.name || dict.search.unknown}</span>
                                    </p>

                                    <p className="text-sm text-gray-800 leading-relaxed">
                                        {result.desscription ?? ""}
                                    </p>
                                </article>
                            ))}
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6 sm:space-y-8">
                            {featuredTopic && (
                                <div className="rounded border border-gray-200 bg-white shadow-sm">
                                    {featuredTopic.image ? (
                                        <div className="relative h-40 sm:h-48 w-full overflow-hidden">
                                            <Image
                                                src={featuredTopic.image!}
                                                alt={featuredTopic.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : null}
                                    <div className="p-3 sm:p-4">
                                        <Link
                                            href={buildTopicHref(featuredTopic)}
                                            className="text-base sm:text-lg font-bold text-blue-600 hover:underline"
                                        >
                                            {featuredTopic.name}
                                        </Link>
                                        <p className="mt-2 text-xs uppercase tracking-wide text-gray-500">
                                            {formatItemCount(featuredTopic.count)}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {relatedTopics.length > 0 && (
                                <div className="border-t border-gray-200 pt-4 sm:pt-6">
                                    <h4 className="text-sm font-bold text-gray-900 mb-3 sm:mb-4">
                                        {dict.search["related-topics"]}
                                    </h4>
                                    <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                                        {relatedTopics.map((topic) => (
                                            <div key={topic.name} className="flex flex-col overflow-hidden rounded border border-gray-200 bg-white">
                                                <Link href={buildTopicHref(topic)} className="group">
                                                    {topic.image ? (
                                                        <div className="relative h-20 sm:h-24 w-full overflow-hidden">
                                                            <Image
                                                                src={topic.image!}
                                                                alt={topic.name}
                                                                fill
                                                                className="object-cover transition-transform duration-200 group-hover:scale-105"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-20 sm:h-24 items-center justify-center bg-gray-100 text-sm text-gray-500">
                                                            {topic.name}
                                                        </div>
                                                    )}
                                                    <div className="px-2 sm:px-3 py-2">
                                                        <p className="text-sm font-semibold text-blue-600 group-hover:underline">
                                                            {topic.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatItemCount(topic.count)}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}
