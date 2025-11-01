"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface Ad {
    _id: string;
    title: string;
    imageUrl: string;
    link: string;
    position: string;
    status: string;
}

interface AdDisplayProps {
    position: "sidebar" | "content" | "bottom";
}

export default function AdDisplay({ position }: AdDisplayProps) {
    const [ad, setAd] = useState<Ad | null>(null);
    const [loading, setLoading] = useState(true);
    const [impressed, setImpressed] = useState(false);

    const fetchAd = useCallback(async () => {
        try {
            const response = await fetch(`/api/v1/ads?status=active&limit=1`);
            if (response.ok) {
                const data = await response.json();
                // Filter ads by position
                const positionAds = data.ads.filter((a: Ad) => a.position === position);
                if (positionAds.length > 0) {
                    // Randomly select one if multiple ads exist
                    const randomAd = positionAds[Math.floor(Math.random() * positionAds.length)];
                    setAd(randomAd);
                }
            }
        } catch (error) {
            console.error("Failed to fetch ad:", error);
        } finally {
            setLoading(false);
        }
    }, [position]);

    const trackImpression = useCallback(async () => {
        if (!ad) return;
        try {
            await fetch("/api/v1/ads/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adId: ad._id, type: "impression" }),
            });
        } catch (error) {
            console.error("Failed to track impression:", error);
        }
    }, [ad]);

    useEffect(() => {
        fetchAd();
    }, [fetchAd]);

    useEffect(() => {
        // Track impression when ad is visible
        if (ad && !impressed) {
            trackImpression();
            setImpressed(true);
        }
    }, [ad, impressed, trackImpression]);

    const handleClick = async () => {
        if (!ad) return;
        try {
            await fetch("/api/v1/ads/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adId: ad._id, type: "click" }),
            });
        } catch (error) {
            console.error("Failed to track click:", error);
        }
    };

    if (loading) {
        return (
            <div className="w-full bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading...</div>
            </div>
        );
    }

    if (!ad) {
        return null; // Don't show anything if no ad is available
    }

    const AdContent = () => (
        <div className="w-full rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-white relative">
            <Image
                src={ad.imageUrl}
                alt={ad.title}
                width={300}
                height={250}
                className="w-full h-auto object-cover"
            />
        </div>
    );

    if (ad.link) {
        return (
            <a
                href={ad.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="block hover:opacity-90 transition-opacity"
            >
                <AdContent />
            </a>
        );
    }

    return <AdContent />;
}
