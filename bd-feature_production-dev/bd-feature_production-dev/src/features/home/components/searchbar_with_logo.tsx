import Link from "next/link";

import { getDictionary } from "../../../app/[lang]/dictionaries";
import { Locales } from "../../../middleware";
import { cn } from "../../../utils/utils";
import SectionsList from "./sections_list";

interface SearchBarWithLogoProps {
  className?: string;
  lang: Locales;
}

const SearchBarWithLogo: React.FC<SearchBarWithLogoProps> = async (props) => {
  const dict = await getDictionary(props.lang);
  return (
    <div
      className={cn(
        "hidden border-b border-solid border-gray-200 text-center lg:block",
        props.className
      )}
    >
      <div className="hidden font-sans lg:block">
        <section className="bg-masthead pt-5">
          <div className="tc-container mx-auto">
            <header className="mx-auto flex justify-between">
              <div className="flex flex-col items-start">
                <Link href={""} className="font-bold text-4xl">
                  BD-FEATURE
                </Link>
                <div className="mt-1 text-2xs font-bold text-gray-700">
                  {dict["search-section"]["academic-rigour..."]}
                </div>
              </div>
              <form
                action={`/${props.lang}/search`}
                method="GET"
                className="relative mx-2 my-3 flex basis-1/3 flex-row content-around lg:my-4"
              >
                <input
                  type="text"
                  name="q"
                  className="box-border w-full rounded-full border border-solid border-gray-300 py-3 pl-5 pr-10 font-sans text-xs text-black placeholder:text-gray-600 focus:placeholder:text-gray-200"
                  placeholder={dict["search-section"]["search-analaysis..."]}
                />
                <div className="absolute right-0 m-2">
                  <button type="submit" className="mt-px cursor-pointer border-none bg-transparent px-1 py-0 text-gray-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                      name="Search"
                      role="search"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </form>
            </header>
            <SectionsList />
          </div>
        </section>
      </div>
    </div>
  );
};

export default SearchBarWithLogo;
