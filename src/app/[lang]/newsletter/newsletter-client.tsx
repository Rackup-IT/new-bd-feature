"use client";

import { useState } from "react";
import type { Dictionary } from "../dictionaries";

interface NewsletterPageClientProps {
    lang: string;
    dict: Dictionary;
}

export default function NewsletterPageClient({ lang, dict }: NewsletterPageClientProps) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !name) {
            setStatus("error");
            setMessage(dict.newsletter?.["fill-all-fields"] || "Please fill in all fields");
            return;
        }

        try {
            setLoading(true);
            setStatus("idle");

            const response = await fetch("/api/v1/newsletter/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, name, language: lang }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage(dict.newsletter?.["success-message"] || "Successfully subscribed to newsletter!");
                setEmail("");
                setName("");
            } else {
                setStatus("error");
                setMessage(data.message || dict.newsletter?.["error-message"] || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Newsletter subscription error:", error);
            setStatus("error");
            setMessage(dict.newsletter?.["error-message"] || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
                    {/* Icon and Title */}
                    <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0">
                            <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {dict.newsletter?.title || "Before you go ..."}
                            </h1>
                            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                                {dict.newsletter?.description ||
                                    "We're building a community of experts dedicated to rebuilding trust and serving the public by making knowledge available to everyone. Join us at the beginning of our journey and receive a curated list of articles in your inbox twice a week. Be among our first subscribers!"}
                            </p>
                        </div>
                    </div>

                    {/* Subscription Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                {dict.newsletter?.["name-label"] || "Full Name"}
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={dict.newsletter?.["name-placeholder"] || "Enter your name"}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                disabled={loading}
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                {dict.newsletter?.["email-label"] || "Email Address"}
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={dict.newsletter?.["email-placeholder"] || "your.email@example.com"}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                disabled={loading}
                            />
                        </div>

                        {/* Status Messages */}
                        {status === "success" && (
                            <div className="bg-green-50 border border-green-200 rounded-md p-4">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-green-800">{message}</p>
                                </div>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-red-800">{message}</p>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-md transition-colors text-lg"
                        >
                            {loading
                                ? (dict.newsletter?.["subscribing"] || "Subscribing...")
                                : (dict.newsletter?.["subscribe-button"] || "Get our newsletter")}
                        </button>
                    </form>

                    {/* Site Info */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">The BD-Feature</h3>
                                <p className="text-sm text-gray-600">
                                    {dict.newsletter?.tagline || "Academic rigour, journalistic flair"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Note */}
                    <p className="mt-6 text-xs text-gray-500">
                        {dict.newsletter?.["privacy-note"] ||
                            "We respect your privacy. Unsubscribe at any time. See our privacy policy for details."}
                    </p>
                </div>
            </div>
        </div>
    );
}
