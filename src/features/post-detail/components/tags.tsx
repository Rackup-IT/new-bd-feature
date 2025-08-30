import Link from "next/link";

export default function Tags() {
  return (
    <div className="flex items-start">
      <i className="mr-[5px] before:content-['󠀪🏷'] top-0"></i>
      <ul className="w-full list-none mt-1">
        <li className="float-left">
          <Link
            href={"/tags/climate-change"}
            className="bg-[#f2f2f3] rounded-[2px] text-[#4b4b4e] block text-[12px] font-bold mr-[6px] mb-[6px] px-[6px] whitespace-nowrap hover:bg-[#d8372c] hover:text-white"
          >
            Climate Change
          </Link>
        </li>
        <li className="float-left">
          <Link
            href={"/tags/climate-change"}
            className="bg-[#f2f2f3] rounded-[2px] text-[#4b4b4e] block text-[12px] font-bold mr-[6px] mb-[6px] px-[6px] whitespace-nowrap hover:bg-[#d8372c] hover:text-white"
          >
            International Law
          </Link>
        </li>
      </ul>
    </div>
  );
}
