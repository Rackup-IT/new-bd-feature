import Link from "next/link";
import { Dictionary } from "../../../app/[lang]/dictionaries";

interface NewsLetterLinkProps {
  dict: Dictionary;
}

const NewsLetterLink: React.FC<NewsLetterLinkProps> = (props) => {
  return (
    <Link
      href={""}
      className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white visited:text-white hover:bg-gray-700 hover:text-white lg:px-5 lg:py-2"
    >
      {props.dict["Main-Top-Bar"].newsletter}
    </Link>
  );
};

export default NewsLetterLink;
