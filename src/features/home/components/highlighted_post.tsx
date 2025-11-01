"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { DBResponseSchema } from "@/features/admin-panel/validation/blog/db_response";
import React from "react";

interface HightlightPostProps {
  post: DBResponseSchema;
}

const HighligtedPost: React.FC<HightlightPostProps> = (props) => {
  const pathname = usePathname();
  return (
    <div className="group relative col-span-full flex overflow-hidden sm:col-span-6 row-span-2 border-t border-solid border-gray-300 pt-4">
      <Link
        className="group relative flex min-h-96 w-full flex-col justify-end sm:min-h-80 lg:min-h-96 xl:min-h-120"
        href={`/${pathname.startsWith("/bn") ? "bn" : "en"}/${props.post.slug}`}
      >
        <div className="absolute inset-0">
          <Image
            src={props.post.image}
            alt="testing"
            height={600}
            width={600}
            priority
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black from-20% to-60% opacity-85"></div>
        <section className="relative flex max-w-screen-md flex-col items-start gap-4 p-4 text-white md:p-8 xl:max-w-screen-lg">
          <span className="drop-shadow-dark group-hover:underline">
            <h3 className="font-bold font-sans-heading text-xl lg:text-2xl xl:text-3xl">
              <span>{props.post.title}</span>
            </h3>
          </span>
          <p className="line-clamp-3 text-sm font-bold drop-shadow">
            {props.post.writter.name}
          </p>
        </section>
      </Link>
    </div>
  );
};

export default HighligtedPost;
