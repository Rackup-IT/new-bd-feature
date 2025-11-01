'use client';

// components/DesktopNavigation.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

interface Section {
  _id?: string;
  title: string;
  edition: 'global' | 'bangladesh';
  href: string;
}

interface DesktopNavigationProps {
  className?: string;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ className = '' }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  // Determine edition based on current URL
  const getEditionFromPath = useCallback(() => {
    if (pathname?.startsWith('/bn')) {
      return 'bangladesh';
    }
    return 'global'; // Default to global for all other languages
  }, [pathname]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/section', { next: { revalidate: 3600 } });
        if (!response.ok) {
          throw new Error('Failed to fetch sections');
        }
        const allSections = await response.json();
        const currentEdition = getEditionFromPath();
        // Filter sections based on current edition
        const filteredSections = allSections.filter(
          (section: Section) => section.edition === currentEdition,
        );
        setSections(filteredSections || []);
      } catch (err) {
        setError('Failed to load sections');
        console.error('Error fetching sections:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [pathname, getEditionFromPath]);

  return (
    <nav
      className={`hidden text-3xs font-bold text-black lg:flex lg:text-2xs 2xl:text-sm ${className}`}
      data-testid="desktopMenu"
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
              <Link
                key={section._id || section.href}
                href={`/${pathname.startsWith('/bn') ? 'bn' : 'en'}/section/${section.href}`}
                className={`mr-2.5 border-b-4 pb-2 pt-3 font-sans hover:border-red-600 2xl:mr-4 ${
                  isActive ? 'border-red-600' : 'border-transparent'
                }`}
              >
                {section.title}
              </Link>
            );
          })}
        </>
      ) : (
        <div className="py-2 px-4">No sections available</div>
      )}
    </nav>
  );
};

export default DesktopNavigation;
