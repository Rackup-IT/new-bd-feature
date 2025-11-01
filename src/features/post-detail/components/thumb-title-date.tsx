import Image from "next/image";

import { cn } from "../../../utils/utils";

interface ThumbTitleDate {
  thumbnailImage: string;
  title: string;
  date: string;
}

// Safe date formatting function
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

export default function ThumbTitleDate({
  date,
  thumbnailImage,
  title,
}: ThumbTitleDate) {
  return (
    <figure className="relative overflow-hidden">
      <Image
        src={thumbnailImage}
        alt="a cat is sitting on a chair"
        width={300}
        height={200}
        className={cn("object-cover w-full", "sm:h-[600px]")}
        sizes="(max-width: 300px) 300px, (max-width: 600px) 500px"
      />
      <div className="wrapper md:mx-auto">
        <header
          className={cn(
            "mr-5 float-left",
            "sm:absolute sm:bottom-[20px] sm:-left-4 sm:w-[724px] sm:border-l-[24px] sm:border-solid sm:border-white sm:pt-[1px]",
            "lg:left-auto lg:border-l-[10px]",
            "xl:w-[926px]"
          )}
        >
          <h1
            className={cn(
              "text-[28px] font-sans-heading leading-[1.2] text-[#383838] pt-2",
              "sm:text-[38px] sm:leading-[1.2] sm:inline sm:bg-white sm:pb-1 sm:box-decoration-clone sm:pr-4 sm:pt-0"
            )}
          >
            <strong>{title}</strong>
          </h1>
          <div className="block max-sm:py-[12px]">
            <time
              dateTime={date}
              className={cn(
                "text-[#4b4b4e] text-[13px]",
                "sm:inline sm:bg-white sm:px-3 sm:py-[4px] sm:box-decoration-clone"
              )}
            >
              Published: {formatDate(date)}
            </time>
          </div>
        </header>
      </div>
    </figure>
  );
}
