import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, calculateReadingTime } from '@/lib/utils/date';
import { normalizeImageUrl, isValidImageUrl } from '@/lib/utils/image';
import type { ArticleWithRelations } from '@/lib/types/article';

interface ArticleCardProps {
  article: ArticleWithRelations;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const readingTime = article.description
    ? calculateReadingTime(article.description.split(/\s+/).length)
    : 0;
  const imageUrl = normalizeImageUrl(article.image);
  const hasValidImage = imageUrl && isValidImageUrl(imageUrl);

  return (
    <Link href={`/articles/${article.slug}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
        <div className={`relative ${featured ? 'h-64' : 'h-48'} w-full overflow-hidden`}>
          {hasValidImage ? (
            <Image
              src={imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
              onError={(e) => {
                // Hide image on error, show placeholder
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--omerald-teal)] to-[var(--omerald-teal-dark)] flex items-center justify-center">
              <span className="text-white text-2xl font-bold opacity-50">No Image</span>
            </div>
          )}
        </div>
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-2">
            {article.topics?.slice(0, 2).map((topic) => (
              <Badge key={topic.id} variant="secondary" className="text-xs">
                {topic.name}
              </Badge>
            ))}
          </div>
          <h3 className={`font-semibold text-[var(--text-primary)] line-clamp-2 ${featured ? 'text-xl' : 'text-lg'}`}>
            {article.title}
          </h3>
        </CardHeader>
        <CardContent>
          {article.short_description && (
            <p className="text-sm text-[var(--text-muted)] line-clamp-3 mb-4">
              {article.short_description}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>{formatDate(article.created_at)}</span>
            {readingTime > 0 && <span>{readingTime} min read</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

