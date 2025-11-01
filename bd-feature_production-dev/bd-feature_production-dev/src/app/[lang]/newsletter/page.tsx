import { getDictionary } from "../dictionaries";
import SearchBarWithLogo from "@/features/home/components/searchbar_with_logo";
import NewsletterPageClient from "./newsletter-client";

interface NewsletterPageProps {
    params: Promise<{
        lang: string;
    }>;
}

export default async function NewsletterPage({ params }: NewsletterPageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "en" | "bn");

    return (
        <>
            <SearchBarWithLogo lang={lang as "en" | "bn"} />
            <NewsletterPageClient lang={lang} dict={dict} />
        </>
    );
}

export async function generateMetadata({ params }: NewsletterPageProps) {
    const { lang } = await params;
    return {
        title: lang === "bn" ? "নিউজলেটার সাবস্ক্রাইব করুন - BD-Feature" : "Subscribe to Newsletter - BD-Feature",
        description: lang === "bn"
            ? "আমাদের নিউজলেটার সাবস্ক্রাইব করুন এবং সপ্তাহে দুবার আপনার ইনবক্সে নির্বাচিত নিবন্ধ পান।"
            : "Subscribe to our newsletter and receive curated articles in your inbox twice a week.",
    };
}
