import Image from "next/image";
import Link from "next/link";
import { ClientSideValidationSchema } from "../../admin-panel/validation/author/client_side";

import { cn } from "../../../utils/utils";

interface AuthorDetailProps {
  authorData: ClientSideValidationSchema & { _id?: string };
  lang?: string;
}

export default function AuthorDetail(props: AuthorDetailProps) {
  return (
    <div className="sm:hidden">
      <details>
        <summary className="text-[12px] cursor-pointer mb-[12px]">
          <span className="font-[700] text-[#085d91]">
            {props.authorData.name},{" "}
          </span>
          <span className="italic">{props.authorData.occupation}</span>
        </summary>
        <div className="flex flex-col w-full">
          <h3
            className={cn(
              "text-[12px] leading-[18px] font-bold  pb-[.33rem] mb-3",
              "border-b-[1px] border-solid border-[#d7d7db]"
            )}
          >
            Author
          </h3>
          <div className="flex mb-2">
            <div className="size-12 rounded-full mr-3 mb-[18px]">
              <Image
                src={props.authorData.profileImage as string}
                alt="Author's Avatar"
                width={150}
                height={150}
                className="object-cover w-full h-full rounded-full"
              />
            </div>
            <div className="flex flex-col mt-1">
              <Link
                href={props.lang ? `/${props.lang}/profile/${props.authorData._id || 'unknown'}` : "#"}
                className="font-[700] text-[#085d91] text-[13px]"
              >
                {props.authorData.name}
              </Link>
              <p className="text-[11px] leading-[1.2] text-[#4b4b4e]">
                {props.authorData.occupation}
              </p>
            </div>
          </div>
          <section className="mb-[36px]">
            <h3
              className={cn(
                "text-[12px] leading-[18px] font-bold  pb-[.33rem] mb-3",
                "border-b-[1px] border-solid border-[#d7d7db]"
              )}
            >
              Disclosure statement
            </h3>
            <p className="text-[12px]">
              <span>{props.authorData.bio}</span>
            </p>
          </section>
          {/* <section className="mb-[36px]">
            <h3
              className={cn(
                "text-[12px] leading-[18px] font-bold  pb-[.33rem] mb-3",
                "border-b-[1px] border-solid border-[#d7d7db]"
              )}
            >
              Partners
            </h3>
            <p className="text-[12px]">
              <span>
                Australian National University provides funding as a member of
                The Conversation AU.
              </span>
            </p>
          </section> */}
        </div>
      </details>
    </div>
  );
}
