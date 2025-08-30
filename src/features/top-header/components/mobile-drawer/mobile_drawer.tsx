"use client";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import NewsletterBtn from "./newletter_btn";
import RegionSelector from "./region_selector";
import SearchForm from "./search_form";
import SectionLink from "./section_link";

import { cn } from "../../../../utils/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface Section {
  _id?: string;
  title: string;
  edition: "global" | "bangladesh";
  href: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  // Determine edition based on current URL
  const getEditionFromPath = useCallback(() => {
    if (pathname?.startsWith("/bn")) {
      return "bangladesh";
    }
    return "global"; // Default to global for all other languages
  }, [pathname]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/v1/section");
        if (!response.ok) {
          throw new Error("Failed to fetch sections");
        }
        const allSections = await response.json();
        const currentEdition = getEditionFromPath();
        // Filter sections based on current edition
        const filteredSections = allSections.filter(
          (section: Section) => section.edition === currentEdition
        );
        setSections(filteredSections || []);
      } catch (err) {
        setError("Failed to load sections");
        console.error("Error fetching sections:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchSections();
    }
  }, [isOpen, pathname, getEditionFromPath]);

  return (
    <section
      className={cn(
        "absolute top-px mt-10 w-full overflow-hidden bg-white text-gray-800 transition-all duration-500 lg:hidden overflow-y-auto",
        isOpen ? "h-screen" : "h-0"
      )}
      role="region"
      data-testid="mobileMenu"
    >
      {/* Search Form */}
      <SearchForm />

      {/* Navigation Menu */}
      <div
        className="my-3 mb-8 flex flex-col font-sans-heading text-xl font-bold"
        role="menu"
        aria-orientation="vertical"
      >
        {loading ? (
          <div className="py-2 px-4">Loading sections...</div>
        ) : error ? (
          <div className="py-2 px-4 text-red-500">{error}</div>
        ) : sections.length > 0 ? (
          <>
            {sections.map((section) => {
              // Check if current path matches the section href
              const isActive = pathname?.includes(`/section/${section.href}`);
              return (
                <SectionLink
                  key={section._id || section.href} // Use href as fallback if _id is undefined
                  href={`/${pathname.startsWith("/bn") ? "bn" : "en"}/section/${
                    section.href
                  }`}
                  isActive={isActive}
                  onClick={onClose}
                >
                  {section.title}
                </SectionLink>
              );
            })}
          </>
        ) : (
          <div className="py-2 px-4">No sections available</div>
        )}
      </div>

      {/* Region Selector */}
      <RegionSelector />

      {/* Newsletter Button */}
      <NewsletterBtn />
    </section>
  );
};

export default MobileMenu;
