import { Dictionary } from "@/app/[lang]/dictionaries";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

interface RegionSelectorProps {
  currentRegion?: string;
  className?: string;
  dict: Dictionary;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({
  className = "",
  dict,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Determine current region based on URL path
  const currentRegion = pathname.startsWith("/en")
    ? dict["Main-Top-Bar"].global
    : dict["Main-Top-Bar"].bangladesh;

  const regions = [
    { name: dict["Main-Top-Bar"].global, href: "/en" },
    { name: dict["Main-Top-Bar"].bangladesh, href: "/bn" },
  ];

  return (
    <div
      className={`hidden h-full lg:block ${className}`}
      data-testid="region-dropdown"
    >
      <div className="relative h-full border-x border-solid border-gray-200">
        <div className="flex h-full items-center">
          <span className="ml-3 font-sans text-xs">
            {dict["Main-Top-Bar"].edition}:
          </span>
          <div className="relative inline-block h-full">
            <div className="inline-flex h-full">
              <button
                className="inline-flex items-center text-xs transition text-black hover:bg-gray-50 py-3.5 px-2.5 max-sm:!px-2"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="pr-2 font-bold text-red-600">
                  {currentRegion}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-down size-4"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>
            </div>

            {isOpen && (
              <div
                className="absolute flex w-36 min-w-max flex-col border border-t-0 border-gray-100 bg-white w-36 z-10"
                role="menu"
                aria-orientation="vertical"
              >
                {regions.map((region) => (
                  <Link
                    key={region.href}
                    href={region.href}
                    className="inline-flex items-center text-xs transition text-black hover:bg-gray-50 py-3.5 px-2.5 max-sm:!px-2"
                    role="menuitem"
                  >
                    {region.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionSelector;
