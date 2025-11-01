import { Locales } from "@/middleware";
import { getDictionary } from "../dictionaries";
import SearchPageClient from "./search-client";
import SearchBarWithLogo from "@/features/home/components/searchbar_with_logo";

export default async function SearchPage({
    params,
}: {
    params: Promise<{ lang: Locales }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <>
            <SearchBarWithLogo lang={lang} />
            <SearchPageClient lang={lang} dict={dict} />
        </>
    );
}
