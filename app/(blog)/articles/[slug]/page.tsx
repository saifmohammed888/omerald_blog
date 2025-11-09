'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { useArticle } from '@/lib/api/hooks/use-articles';
import { AuthorInfo } from '@/components/blog/author-info';
import { Badge } from '@/components/ui/badge';
import { ArticleList } from '@/components/blog/article-list';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate, calculateReadingTime } from '@/lib/utils/date';
import { normalizeImageUrl, isValidImageUrl } from '@/lib/utils/image';

export default function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: article, isLoading } = useArticle(slug, true);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Article not found</h1>
        <Link href="/articles" className="text-[var(--omerald-teal)] hover:underline">
          Back to Articles
        </Link>
      </div>
    );
  }

  const readingTime = article.description
    ? calculateReadingTime(article.description.split(/\s+/).length)
    : 0;

  // Get related articles (same topics)
  const relatedTopicIds = article.topics?.map((t) => t.id).join(',') || '';

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const articleUrl = `${siteUrl}/articles/${article.slug}`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.short_description || '',
    image: article.image ? `${siteUrl}${article.image}` : undefined,
    datePublished: article.created_at.toISOString(),
    dateModified: article.updated_at.toISOString(),
    author: {
      '@type': 'Person',
      name: 'Omerald Writer',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Omerald Blog',
    },
  };

  return (
    <>
      <Script
        id="article-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="max-w-4xl mx-auto">
        {/* Article Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {article.topics?.map((topic) => (
              <Link key={topic.id} href={`/topics/${topic.slug}`}>
                <Badge variant="secondary" className="cursor-pointer hover:opacity-80">
                  {topic.name}
                </Badge>
              </Link>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            {article.title}
          </h1>
          
          {article.short_description && (
            <p className="text-xl text-[var(--text-secondary)] mb-6">
              {article.short_description}
            </p>
          )}

          <div className="flex items-center justify-between mb-6">
            <AuthorInfo article={article} />
            {readingTime > 0 && (
              <span className="text-sm text-[var(--text-muted)]">
                {readingTime} min read
              </span>
            )}
          </div>
        </div>

        {/* Article Image */}
        {(() => {
          const imageUrl = normalizeImageUrl(article.image);
          const hasValidImage = imageUrl && isValidImageUrl(imageUrl);
          return hasValidImage ? (
            <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 896px"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : null;
        })()}

        {/* Article Content */}
        {article.description && (
          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: article.description }}
          />
        )}

        {/* Article Footer */}
        <div className="border-t border-[var(--omerald-silver)] pt-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm font-medium text-[var(--text-primary)]">Topics:</span>
            {article.topics?.map((topic) => (
              <Link key={topic.id} href={`/topics/${topic.slug}`}>
                <Badge variant="outline" className="cursor-pointer hover:opacity-80">
                  {topic.name}
                </Badge>
              </Link>
            ))}
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Published on {formatDate(article.created_at)}
            {article.updated_at && article.updated_at !== article.created_at && (
              <> • Updated on {formatDate(article.updated_at)}</>
            )}
          </p>
        </div>
      </article>

      {/* Related Articles */}
      {article.topics && article.topics.length > 0 && (
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
            Related Articles
          </h2>
          {/* Note: In a real implementation, you'd fetch related articles here */}
          <p className="text-[var(--text-muted)]">Related articles would be shown here based on topics.</p>
        </div>
      )}
      </div>
    </>
  );
}

