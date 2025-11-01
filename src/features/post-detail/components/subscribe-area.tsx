import Link from "next/link";
import BDFeatureIcon from "../../../assets/custom-icon/bd_feature_no_text_icon";

interface SubscribeAreaProps {
  lang?: string;
}

export default function SubscribeArea({ lang = "en" }: SubscribeAreaProps) {
  return (
    <div className="w-full rounded-lg bg-[#F8F8F8] p-6 mt-4">
      <h6 className="mb-1 break-words font-sans-heading text-sm font-bold text-gray-800 sm:text-base">
        Before you go ...
      </h6>
      <p className="whitespace-pre-line break-words font-serif text-base text-gray-800 sm:text-lg">
        We&apos;re building a community of experts dedicated to rebuilding trust
        and serving the public by making knowledge available to everyone. Join
        us at the beginning of our journey and receive a curated list of
        articles in your inbox twice a week. Be among our first subscribers!
      </p>
      <p className="my-4">
        <Link
          href={`/${lang}/newsletter`}
          className="inline-block max-w-full cursor-pointer break-words rounded border-none px-10 py-2 font-sans text-base font-semibold tracking-wide text-white transition-colors duration-300 bg-indigo-600 hover:bg-indigo-800"
        >
          Get our newsletter
        </Link>
      </p>
      <div className="flex items-center gap-3 break-words text-gray-800">
        {/* <Image
          src={"/bd-feature_icon.svg"}
          height={100}
          width={100}
          alt="Author's Avatar"
          className="size-12 rounded-full border border-solid border-gray-200"
        /> */}
        <div className="size-12 rounded-full border border-solid border-gray-200 flex items-center justify-center pl-2">
          <BDFeatureIcon />
        </div>
        <div>
          <div className="text-base leading-snug">The BD-Feature</div>
          <div className="text-2xs">Academic rigour, journalistic flair</div>
        </div>
      </div>
    </div>
  );
}
