"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { DBResponseSchema } from "@/features/admin-panel/validation/blog/db_response";
import React from "react";

interface NonHighlightedPostProps {
  post: DBResponseSchema;
}

const NonHighlightedPost: React.FC<NonHighlightedPostProps> = (props) => {
  const pathname = usePathname();
  return (
    <div className="group relative col-span-full flex overflow-hidden sm:col-span-3 border-t border-solid border-gray-300 pt-4">
      <Link
        href={`/${pathname.startsWith("/bn") ? "bn" : "en"}/${props.post.slug}`}
        className="group grid h-fit w-full grid-cols-3 gap-x-4 gap-y-2 2xl:gap-x-8"
      >
        <section className="order-first col-span-2 sm:order-last sm:col-span-3">
          <span className="group-hover:text-indigo-600 group-hover:underline">
            <h5 className="font-bold font-sans-heading text-base leading-5 lg:text-lg lg:leading-6">
              <span>{props.post.title}</span>
            </h5>
          </span>
          <p className="mt-1 line-clamp-4 text-3xs text-gray-600">
            {props.post.writter.name}
          </p>
          <div className="mt-2 empty:mt-0"></div>
        </section>
        <div className="relative col-span-3 hidden aspect-video sm:block">
          <Image
            src={props.post.image}
            alt=""
            fill
            sizes="(min-width: 2560px) 640px, (min-width: 1466px) 367px, (min-width: 1280px) 320px, (min-width: 1024px) 256px, (min-width: 768px) 192px, 320px"
            className="object-cover"
          />
        </div>
        <div className="relative col-span-1 aspect-square sm:hidden">
          <Image
            src={props.post.image}
            alt=""
            fill
            sizes="(min-width: 2560px) 640px, (min-width: 1466px) 367px, (min-width: 1280px) 320px, (min-width: 1024px) 256px, (min-width: 768px) 192px, 320px"
            className="object-cover"
          />
        </div>
      </Link>
    </div>
  );
};

export default NonHighlightedPost;
