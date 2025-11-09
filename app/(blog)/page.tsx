'use client';

import { HeroPost } from '@/components/blog/hero-post';
import { FeaturedPosts } from '@/components/blog/featured-posts';
import { ArticleList } from '@/components/blog/article-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useFeaturedArticles, useArticles } from '@/lib/api/hooks/use-articles';
import Script from 'next/script';

export default function HomePage() {
  const { data: featuredData, isLoading: featuredLoading, error: featuredError } = useFeaturedArticles(6);
  const { data: recentData, isLoading: recentLoading, error: recentError } = useArticles({
    status: 1,
    limit: 9,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const heroArticle = featuredData?.articles?.[0];
  const sidebarArticles = featuredData?.articles?.slice(1, 6) || [];
  const recentArticles = recentData?.articles?.slice(0, 9) || [];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Omerald Blog',
    url: siteUrl,
    description: 'Discover health and wellness articles covering Ayurveda, natural remedies, nutrition, and more.',
  };

  return (
    <>
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Hero Post */}
        <div className="lg:col-span-2">
          {featuredLoading ? (
            <div className="h-[500px] bg-[var(--omerald-silver)] rounded-lg animate-pulse" />
          ) : heroArticle ? (
            <HeroPost article={heroArticle} />
          ) : null}
        </div>

        {/* Featured Posts Sidebar */}
        <div className="lg:col-span-1">
          {featuredLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-[var(--omerald-silver)] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : sidebarArticles.length > 0 ? (
            <FeaturedPosts articles={sidebarArticles} />
          ) : null}
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">Recent Posts</h2>
          <Button variant="outline" asChild>
            <Link href="/articles">All Posts</Link>
          </Button>
        </div>
        {recentError ? (
          <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Error loading articles</p>
            <p className="text-red-500 dark:text-red-300 text-sm mb-4">
              {recentError instanceof Error ? recentError.message : 'Unknown error occurred'}
            </p>
            <div className="space-y-2 text-left max-w-md mx-auto bg-white dark:bg-gray-800 p-4 rounded">
              <p className="text-gray-700 dark:text-gray-300 text-xs font-semibold">Quick Fixes:</p>
              <ol className="text-gray-600 dark:text-gray-400 text-xs space-y-1 list-decimal list-inside">
                <li>Check <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">.env.local</code> file exists with database credentials</li>
                <li>Verify MySQL is running</li>
                <li>Run database schema: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">lib/db/schema.sql</code></li>
                <li>Seed database: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">npm run seed</code></li>
                <li>Check health: <a href="/api/health" target="_blank" className="text-blue-600 dark:text-blue-400 underline">/api/health</a></li>
              </ol>
            </div>
          </div>
        ) : (
          <ArticleList articles={recentArticles} loading={recentLoading} columns={3} />
        )}
      </div>
      </div>
    </>
  );
}
