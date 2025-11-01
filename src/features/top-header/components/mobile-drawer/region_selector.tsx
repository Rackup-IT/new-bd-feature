"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Region_Selector = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedRegion, setSelectedRegion] = useState("en");

  // Sync selected region with current path
  useEffect(() => {
    if (pathname) {
      const pathParts = pathname.split("/");
      const currentRegion = pathParts[1] === "bn" ? "bn" : "en";
      setSelectedRegion(currentRegion);
    }
  }, [pathname]);

  return (
    <div className="m-4">
      <label
        htmlFor="mobile-region-dropdown"
        className="mb-1 block text-sm font-bold"
      >
        Edition:
      </label>
      <div className="w-full rounded-sm border border-gray-400 p-2">
        <select
          id="mobile-region-dropdown"
          onChange={(e) => {
            router.push(`/${e.target.value}`);
            router.refresh();
          }}
          value={selectedRegion}
          className="w-full bg-white text-sm outline-none"
        >
          <option value="en">Global</option>
          <option value="bn">Bangladesh</option>
        </select>
      </div>
    </div>
  );
};

export default Region_Selector;
