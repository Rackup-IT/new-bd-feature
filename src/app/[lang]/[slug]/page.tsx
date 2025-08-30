import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { DBResponseSchema } from '@/features/admin-panel/validation/blog/db_response';
import AdCard from '@/features/post-detail/components/ad_card';
import MightLike from '@/features/post-detail/components/might-like';
import SearchBarWithLogo from '../../../features/home/components/searchbar_with_logo';
import AuthorDetail from '../../../features/post-detail/components/author-detail';
import BlogArea from '../../../features/post-detail/components/blog-area';
import MightLikeHighlight from '../../../features/post-detail/components/might-like-highlight';
import ContentShareArea from '../../../features/post-detail/components/share-content-area';
import SubscribeArea from '../../../features/post-detail/components/subscribe-area';
import Tags from '../../../features/post-detail/components/tags';
import ThumbTitleDate from '../../../features/post-detail/components/thumb-title-date';
// Locales import removed to avoid unused variable lint error

const fetchPostBySlug = async (slug: string) => {
  // Return mock data for development if no DOMAIN is set
  if (!process.env.DOMAIN) {
    return createMockPost(slug);
  }

  try {
    const result = await fetch(`${process.env.DOMAIN}/api/v1/post/${slug}?writter-data=true`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!result.ok) {
      console.error(`API request failed with status ${result.status}`);
      return createMockPost(slug, `API returned status ${result.status}`);
    }

    const postData = await result.json();
    return postData as DBResponseSchema;
  } catch (error) {
    console.error('Error fetching page data:', error);
    return createMockPost(slug, 'Network error occurred');
  }
};

const createMockPost = (slug: string, reason = 'Development mode'): DBResponseSchema => {
  return {
    _id: 'mock-id',
    title: "Sample Article: Israel's Strategic Considerations in Gaza",
    content: `
      <p>This is sample content for development. ${reason}.</p>
      <p>In this comprehensive analysis, we explore the complex geopolitical landscape surrounding recent developments in the Middle East. This article examines the multifaceted approach to regional stability and the various perspectives from international stakeholders.</p>
      <p>Key topics covered include:</p>
      <ul>
        <li>Historical context and background</li>
        <li>Current political dynamics</li>
        <li>International law considerations</li>
        <li>Regional implications</li>
      </ul>
      <blockquote>
        <p>"Understanding the complexity of international relations requires careful analysis of multiple perspectives and historical precedents." - Academic Expert</p>
      </blockquote>
      <p>This analysis aims to provide readers with a balanced understanding of the situation, drawing from multiple sources and expert opinions to present a comprehensive overview of the current state of affairs.</p>
    `,
    image:
      'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=800&h=400&fit=crop&auto=format&q=60',
    createdAt: new Date().toISOString(),
    // updatedAt: new Date().toISOString(),
    slug: slug,
    status: 'published' as const,
    desscription:
      'A comprehensive analysis of current geopolitical developments and their implications.',
    edition: 'en' as const,
    keywords: JSON.stringify(['politics', 'international relations', 'analysis']),
    section: 'Politics',
    writter: 'Sample Author',
    index: 0,
  };
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetch(`${process.env.DOMAIN}/api/v1/post/${slug}?writter-data=true`, {
    cache: 'force-cache',
  })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);
  if (!post) return { title: 'BD-Feature' };
  return {
    title: post.title,
    description: post.desscription || undefined,
    openGraph: {
      title: post.title,
      description: post.desscription || undefined,
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

const RelatedList = ({ related, lang }: { related: DBResponseSchema[]; lang: string }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 lg:gap-8">
      {related.length > 0 ? (
        related.map((rp: DBResponseSchema, idx: number) => {
          if (idx === 0) {
            return <MightLikeHighlight key={rp._id} post={rp} href={`/${lang}/${rp.slug}`} />;
          }
          return <MightLike key={rp._id} post={rp} href={`/${lang}/${rp.slug}`} />;
        })
      ) : (
        <div className="col-span-1 sm:col-span-4 text-center text-gray-500 italic">
          No related posts found.
        </div>
      )}
    </div>
  );
};

type LangParam = { lang: 'en' | 'bn'; slug: string };
const PostDetailPage = async (props: { params: Promise<LangParam> }) => {
  const { params } = props;
  const { lang, slug } = await params;
  const post = (await fetchPostBySlug(slug)) as DBResponseSchema;
  if (!post) return null;

  // Fetch all posts to find related items
  const fetchAllPosts = async (): Promise<DBResponseSchema[]> => {
    if (!process.env.DOMAIN) return [];
    try {
      const res = await fetch(`${process.env.DOMAIN}/api/v1/post`, {
        method: 'GET',
        cache: 'no-store',
      });
      if (!res.ok) return [];
      return (await res.json()) as DBResponseSchema[];
    } catch (e) {
      console.error('Failed to fetch all posts for related items', e);
      return [];
    }
  };

  const allPosts = await fetchAllPosts();

  // Helper: parse keywords into string array
  const getKeywords = (p: DBResponseSchema) => {
    try {
      return JSON.parse(p.keywords || '[]') as string[];
    } catch {
      return [];
    }
  };

  // Compute relatedness score by shared keywords and same section
  const related = allPosts
    .filter((p) => p._id !== post._id)
    .map((p) => {
      const pKeys = getKeywords(p).map((k) => k.toLowerCase());
      const curKeys = getKeywords(post).map((k) => k.toLowerCase());
      const sharedKeys = curKeys.filter((k) => pKeys.includes(k)).length;
      const sameSection = p.section === post.section ? 1 : 0;
      const score = sharedKeys * 2 + sameSection; // weight keywords higher
      return { post: p, score };
    })
    .filter((r) => r.score > 0) // only those with some relation
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((r) => r.post);

  return (
    <>
      <SearchBarWithLogo lang={lang} />
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            image: post.image ? [post.image] : undefined,
            datePublished: post.createdAt,
            author: { '@type': 'Person', name: post.writter },
            description: post.desscription,
          }),
        }}
      />
      <article>
        <ThumbTitleDate date={post.createdAt} thumbnailImage={post.image} title={post.title} />

        {/* Main content area with responsive layout matching The Conversation */}
        <div className="wrapper mx-auto mt-8 lg:mt-12">
          {/* Mobile-only author details (< 600px) */}
          <div className="md:hidden">
            <AuthorDetail authorData={post.writter} />
          </div>

          <div className="md:grid md:grid-cols-12 md:gap-6 lg:gap-8">
            {/* Left share buttons - appears from 600px+ */}
            <div className="hidden md:block md:col-span-1">
              <div className="sticky top-4">
                <div className="space-y-3">
                  <button className="w-10 h-10 bg-blue-600 text-white hover:bg-blue-700 rounded-sm flex items-center justify-center transition-colors group">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 bg-black text-white hover:bg-gray-800 rounded-sm flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 bg-blue-500 text-white hover:bg-blue-600 rounded-sm flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-sm flex items-center justify-center transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H6.85C4.17 7 2 9.17 2 11.85v.3C2 14.83 4.17 17 6.85 17H11v-1.9H6.85c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8zm9.15 4H13v1.9h4.15C19.83 17 22 14.83 22 12.15v-.3C22 9.17 19.83 7 17.15 7H13v1.9h4.15c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Main content - responsive columns */}
            <main className="md:col-span-7 lg:col-span-7">
              {/* Mobile share area (< 600px) */}
              <div className="md:hidden">
                <ContentShareArea />
              </div>

              {/* The Blog Area */}
              <BlogArea content={post.content} />

              {/* Tags */}
              <Tags />

              {/* Subscribe area */}
              <SubscribeArea />
            </main>

            {/* Right sidebar - appears from 600px+ */}
            <aside className="hidden md:block md:col-span-4 lg:col-span-4  lg:ml-14">
              {/* Author Detail for desktop */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">
                  Author
                </h3>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
                    <Image
                      src={post.writter.profileImage as string}
                      alt="author profile photo"
                      height={150}
                      width={150}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href="#" className="text-sm font-bold text-blue-700 hover:underline">
                      {post.writter.name}
                    </Link>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1">
                      {post.writter.occupation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Disclosure Statement */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">
                  Disclosure statement
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed">{post.writter.bio}</p>
              </div>

              {/* Ad  */}
              <AdCard />
              {/* Partners */}
              {/* <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">
                  Partners
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Australian National University provides funding as a member of
                  The Conversation AU.
                </p>
                <div className="mt-4 flex items-center justify-center p-4 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500 text-center">
                    [University Logo Placeholder]
                  </div>
                </div>
              </div> */}

              {/* More from this author */}
              {/* <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">
                  More from this author
                </h3>
                <div className="space-y-3">
                  <Link href="#" className="block group">
                    <h4 className="text-sm font-bold text-blue-700 group-hover:underline leading-tight">
                      Previous article by this author
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Brief excerpt or description of the previous article...
                    </p>
                  </Link>
                </div>
              </div> */}
            </aside>
          </div>
        </div>

        {/* Related articles - Full width */}
        <div className="wrapper mx-auto mt-16 lg:mt-20 mb-20">
          <div className="border-t border-gray-200 pt-8 lg:pt-12">
            <h3 className="text-lg font-bold text-gray-900 mb-6 lg:text-xl font-sans-heading">
              You might also like
            </h3>
            <Suspense
              fallback={
                <div className="col-span-1 sm:col-span-4 text-center text-gray-500 italic">
                  Loading suggestions...
                </div>
              }
            >
              <RelatedList related={related} lang={lang} />
            </Suspense>
          </div>
        </div>
      </article>
    </>
  );
};

export default PostDetailPage;
