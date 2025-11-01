import { getDictionary } from "../../dictionaries";
import ProfilePageClient from "./profile-client";

interface ProfilePageProps {
    params: Promise<{
        lang: string;
        username: string;
    }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { lang, username } = await params;
    const dict = await getDictionary(lang as "en" | "bn");

    return <ProfilePageClient lang={lang} username={username} dict={dict} />;
}
