"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dictionary } from "../../dictionaries";

interface ProfileData {
    _id: string;
    name: string;
    image?: string;
    title: string;
    institution: string;
    institutionSlug?: string;
    bio: string;
    articlesCount: number;
    commentsCount: number;
    experience: {
        period: string;
        title: string;
        organization: string;
    }[];
    contactFor: string[];
    location?: string;
    orcid?: string;
    joinedDate?: string;
}

interface ProfilePageClientProps {
    lang: string;
    username: string;
    dict: Dictionary;
}

interface Article {
    _id: string;
    title: string;
    slug: string;
    desscription?: string;
    createdAt: string;
}

export default function ProfilePageClient({ lang, username, dict }: ProfilePageClientProps) {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"profile" | "articles">("profile");
    const [articles, setArticles] = useState<Article[]>([]);
    const [articlesLoading, setArticlesLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/v1/profile/${username}`);
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                }
            } catch (error) {
                console.error("Profile fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchProfile();
    }, [username]);

    useEffect(() => {
        const fetchArticles = async () => {
            if (!profile?._id || activeTab !== "articles") return;

            try {
                setArticlesLoading(true);
                const response = await fetch(`/api/v1/profile/${username}/articles`);
                if (response.ok) {
                    const data = await response.json();
                    setArticles(data.articles || []);
                }
            } catch (error) {
                console.error("Articles fetch error:", error);
            } finally {
                setArticlesLoading(false);
            }
        };

        void fetchArticles();
    }, [profile?._id, activeTab, username]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-xl text-gray-600">{dict.profile?.["profile-not-found"] || "Profile not found"}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Profile Image */}
                        <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                            {profile.image ? (
                                <Image
                                    src={profile.image}
                                    alt={profile.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                                    {profile.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                            <p className="text-base text-gray-700 mb-1">
                                {profile.title},{" "}
                                {profile.institutionSlug ? (
                                    <Link
                                        href={`/${lang}/institution/${profile.institutionSlug}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {profile.institution}
                                    </Link>
                                ) : (
                                    <span className="text-blue-600">{profile.institution}</span>
                                )}
                            </p>
                        </div>

                        {/* Stats and CTA */}
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-center items-center">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-900">{profile.articlesCount}</div>
                                    <div className="text-sm text-gray-600">{dict.profile?.articles || "Articles"}</div>
                                </div>
                                {/* <div className="text-center">
                                    <div className="text-3xl font-bold text-gray-900">{profile.commentsCount}</div>
                                    <div className="text-sm text-gray-600">{dict.profile?.comments || "Comments"}</div>
                                </div> */}
                            </div>
                            <Link
                                href={`/${lang}/sign-up`}
                                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded transition-colors text-center"
                            >
                                {dict.profile?.["sign-in-to-contact"] || "Sign in to contact"}
                            </Link>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mt-6 border-b border-gray-300">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === "profile"
                                ? "border-gray-900 text-gray-900"
                                : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            {dict.profile?.profile || "Profile"}
                        </button>
                        <button
                            onClick={() => setActiveTab("articles")}
                            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${activeTab === "articles"
                                ? "border-gray-900 text-gray-900"
                                : "border-transparent text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            {dict.profile?.articles || "Articles"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
                    {/* Left Column - Bio and Experience */}
                    <div className="space-y-8">
                        {/* Bio */}
                        {activeTab === "profile" && (
                            <>
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                        {profile.bio}
                                    </div>
                                </div>

                                {/* Experience Section */}
                                {profile.experience && profile.experience.length > 0 && (
                                    <div className="bg-white rounded-lg p-6 shadow-sm">
                                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                                            {dict.profile?.experience || "Experience"}
                                        </h2>
                                        <div className="space-y-4">
                                            {profile.experience.map((exp, index) => (
                                                <div key={index} className="border-l-2 border-gray-200 pl-4">
                                                    <p className="text-sm text-gray-600 mb-1">{exp.period}</p>
                                                    <p className="font-semibold text-gray-900">{exp.title}</p>
                                                    <p className="text-gray-700">{exp.organization}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === "articles" && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                {articlesLoading ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                    </div>
                                ) : articles.length > 0 ? (
                                    <div className="space-y-6">
                                        {articles.map((article) => (
                                            <article key={article._id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                                                <Link href={`/${lang}/${article.slug}`}>
                                                    <h3 className="text-lg font-bold text-blue-600 hover:underline mb-2">
                                                        {article.title}
                                                    </h3>
                                                </Link>
                                                {article.desscription && (
                                                    <p className="text-sm text-gray-700 mb-2">
                                                        {article.desscription}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500">
                                                    {new Date(article.createdAt).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric"
                                                    })}
                                                </p>
                                            </article>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600 text-center py-8">No articles found.</p>
                                )}
                            </div>
                        )}

                    </div>

                    {/* Right Sidebar - Contact Info */}
                    <div className="space-y-6">
                        {/* Contact For */}
                        {profile.contactFor && profile.contactFor.length > 0 && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">
                                    {dict.profile?.["contact-for"] || "Contact"} {profile.name.split(" ")[0]} {dict.profile?.for || "for"}
                                </h3>
                                <ul className="space-y-2">
                                    {profile.contactFor.map((item, index) => (
                                        <li key={index} className="text-sm text-gray-700 flex items-start">
                                            <span className="mr-2">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Location and Links */}
                        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                            {profile.location && (
                                <div className="flex items-start gap-2 text-sm text-gray-700">
                                    <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{profile.location}</span>
                                </div>
                            )}

                            {profile.orcid && (
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`http://orcid.org/${profile.orcid}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        ORCID
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </Link>
                                </div>
                            )}

                            {profile.joinedDate && (
                                <div className="text-sm text-gray-600 pt-4 border-t border-gray-200">
                                    {dict.profile?.joined || "Joined"} {new Date(profile.joinedDate).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Institution Logo */}
                        {profile.institutionSlug && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <div className="flex items-center justify-center h-24">
                                    {/* Placeholder for institution logo */}
                                    <div className="text-center">
                                        <Link
                                            href={`/${lang}/institution/${profile.institutionSlug}`}
                                            className="text-blue-600 hover:underline font-semibold"
                                        >
                                            {profile.institution}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
