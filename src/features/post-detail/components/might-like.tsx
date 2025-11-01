import { DBResponseSchema } from "@/features/admin-panel/validation/blog/db_response";
import Image from "next/image";
import Link from "next/link";

interface MightLikeHighlightProps {
  post: DBResponseSchema;
  href: string;
}

export default function MightLikeHighlight({
  post,
  href,
}: MightLikeHighlightProps) {
  if (!post) {
    if (!post) {
      return (
        <article className="group relative mb-8">
          <div className="relative overflow-hidden bg-gray-100 aspect-[4/3] mb-3">
            <Link href="#" className="block">
              <Image
                src={
                  "https://images.theconversation.com/files/681707/original/file-20250723-56-tidxc5.jpg?ixlib=js-3.8.0&w=324&h=214&fit=crop&auto=format&q=45"
                }
                alt="Image related to the article"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </Link>
          </div>

          <h3 className="text-md font-bold font-sans-heading leading-tight text-gray-900 mb-2 absolute -bottom-8 inset-x-0 bg-white p-2 mx-3">
            <Link
              href="#"
              className="hover:text-blue-700 text-blue-600 transition-colors duration-200 line-clamp-3"
            >
              Israel&apos;s plans for a full occupation of Gaza would pave the
              way for Israeli resettlement.lans for a full occupation of Gaza
              would pave the way for Israeli resettlement.
            </Link>
          </h3>
        </article>
      );
    }
  }

  return (
    <>
      <article className="group sm:hidden">
        <Link href={href} className="flex gap-x-2">
          <div className="w-[500px] ml-4">
            <Image
              src={post.image}
              alt={post.title}
              height={150}
              width={300}
              className="object-cover aspect-[5/3]"
            />
          </div>
          <h3 className="ext-md font-bold font-sans-heading leading-tight hover:text-blue-700 text-blue-600">
            {post.title}
          </h3>
        </Link>
      </article>
      <article className="group relative mb-8 max-sm:hidden">
        <div className="relative overflow-hidden bg-gray-100 aspect-[4/3] mb-3">
          <Link href={href ?? "#"} className="block">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </Link>
        </div>

        <h3 className="text-md font-bold font-sans-heading leading-tight text-gray-900 mb-2 absolute -bottom-8 inset-x-0 bg-white p-2 mx-3">
          <Link
            href={href ?? "#"}
            className="hover:text-blue-700 text-blue-600 transition-colors duration-200 line-clamp-3"
          >
            {post.title}
          </Link>
        </h3>
      </article>
    </>
  );
}

// <div className="relative overflow-hidden bg-gray-100 aspect-[4/3] mb-3">
//       <Link href="#" className="block">
//         <Image
//           src={post.image}
//           alt={post.title}
//           fill
//           className="object-cover transition-transform duration-300 group-hover:scale-105"
//           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
//         />
//       </Link>
//     </div>

//     <h3 className="text-sm font-bold leading-tight text-gray-900 mb-2">
//       <Link
//         href={post.slug}
//         className="hover:text-blue-700 transition-colors duration-200"
//       >
//         {post.title}
//       </Link>
//     </h3>
