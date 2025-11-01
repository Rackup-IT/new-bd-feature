'use server';
import { PageResponseType } from '@/features/admin-panel/hooks/api/usePageApi';
import { Suspense } from 'react';
import SearchBarWithLogo from '../../features/home/components/searchbar_with_logo';
import Section from '../../features/home/components/section';
import { Locales } from '../../middleware';

const getPageData = async (edition: Locales): Promise<PageResponseType | null> => {
  try {
    const result = await fetch(
      `${process.env.DOMAIN}/api/v1/page?edition=${edition}&navLink=home`,
      {
        method: 'GET',
        next: { revalidate: 3600 }, // cache for 1 hour by default
      },
    );
    if (!result.ok) {
      return null;
    }
    const pageData = await result.json();
    return pageData as PageResponseType;
  } catch {
    return null; // Signal failure to the caller
  }
};

const HomePage = async ({ params }: { params: Promise<{ lang: Locales }> }) => {
  const { lang } = await params;
  const pageDataArray = await getPageData(lang);

  if (!pageDataArray) {
    return (
      <>
        <div className="h-[800px] w-screen tc-container mx-auto my-5 text-center py-10">
          <SearchBarWithLogo lang={lang} />
          <h1 className="text-2xl font-bold mb-4 mt-36">Something went wrong</h1>
          <p className="mb-4">We could not load the homepage right now. Please try again later.</p>
          <p className="text-sm text-gray-300">If the problem persists, contact support.</p>
        </div>
      </>
    );
  }

  // Get the first page from the array or use a fallback
  const pageData: PageResponseType = pageDataArray || { sections: [] };

  return (
    <div className="tc-container mx-auto my-5">
      <SearchBarWithLogo lang={lang} />
      {pageData.sections && pageData.sections.length > 0 ? (
        pageData.sections.map((section) => (
          <Suspense
            key={section._id}
            fallback={<div className="py-6 text-center text-gray-500">Loading section...</div>}
          >
            <div>
              {section.title && !section.title.includes('No Title') && (
                <div className="mt-12 mb-4 first:mt-0 lg:first:mt-12">
                  <h2 className="font-bold font-sans-heading text-2xl leading-7 lg:text-3xl xl:text-4xl">
                    {section.title}
                  </h2>
                </div>
              )}

              <Section
                useHightlightedPost={section.hightlightPost!}
                key={section._id}
                posts={section.posts}
              />
            </div>
          </Suspense>
        ))
      ) : (
        <div className="text-center py-10">
          <p>No sections available at the moment. Please try again later.</p>
        </div>
      )}
      {/* <MostReadList /> */}
    </div>
  );
};

export default HomePage;
