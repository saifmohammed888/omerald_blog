import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils/date';
import { normalizeImageUrl, isValidImageUrl } from '@/lib/utils/image';
import type { ArticleWithRelations } from '@/lib/types/article';

interface HeroPostProps {
  article: ArticleWithRelations;
}

export function HeroPost({ article }: HeroPostProps) {
  const primaryTopic = article.topics?.[0];
  const imageUrl = normalizeImageUrl(article.image);
  const hasValidImage = imageUrl && isValidImageUrl(imageUrl);

  return (
    <Link href={`/articles/${article.slug}`}>
      <div className="relative h-[500px] w-full rounded-lg overflow-hidden group cursor-pointer">
        {hasValidImage ? (
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, 80vw"
            onError={(e) => {
              // Hide image on error
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--omerald-teal)] to-[var(--omerald-teal-dark)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
          {primaryTopic && (
            <Badge variant="default" className="mb-4 w-fit">
              {primaryTopic.name}
            </Badge>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 line-clamp-2">
            {article.title}
          </h1>
          {article.short_description && (
            <p className="text-lg mb-6 line-clamp-2 text-gray-200">
              {article.short_description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">
              {formatDate(article.created_at)}
            </span>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              Read More
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

