import Link from "next/link";

interface TagsProps {
  keywords: string;
  lang: string;
}

export default function Tags({ keywords, lang }: TagsProps) {

  // Remove quotes and brackets, then split by comma
  const cleanedKeywords = keywords.replace(/["\[\]]/g, '');
  const splitedKeyword = cleanedKeywords.split(',').map(k => k.trim()).filter(k => k);

  return (
    <div className="flex items-start">
      <i className="mr-[5px] before:content-['󠀪🏷'] top-0"></i>
      <ul className="w-full list-none mt-1">
        {
          splitedKeyword.map((keywrd, index) => {
            return <li className="float-left" key={index}>
              <Link
                href={`/${lang}/search?q=${encodeURIComponent(keywrd)}`}
                className="bg-[#f2f2f3] rounded-[2px] text-[#4b4b4e] block text-[12px] font-bold mr-[6px] mb-[6px] px-[6px] whitespace-nowrap hover:bg-[#d8372c] hover:text-white"
              >
                {keywrd}
              </Link>
            </li>
          })
        }

      </ul>
    </div>
  );
}
