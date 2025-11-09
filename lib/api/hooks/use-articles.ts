import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiFetch } from '../client';
import type { ArticleListParams, ArticleListResponse, ArticleWithRelations } from '@/lib/types/article';

/**
 * Fetch articles list
 */
export function useArticles(params?: Partial<ArticleListParams>) {
  return useQuery<ArticleListResponse>({
    queryKey: ['articles', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.search) searchParams.set('search', params.search);
      if (params?.topic) searchParams.set('topic', params.topic);
      if (params?.status) searchParams.set('status', params.status.toString());
      if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
      if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);

      try {
        return await apiFetch<ArticleListResponse>(`/api/articles?${searchParams.toString()}`);
      } catch (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Only retry once
  });
}

/**
 * Fetch a single article by ID or slug
 */
export function useArticle(id: string, bySlug = false) {
  return useQuery<ArticleWithRelations>({
    queryKey: ['article', id, bySlug],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (bySlug) searchParams.set('bySlug', 'true');
      return apiFetch<ArticleWithRelations>(`/api/articles/${id}?${searchParams.toString()}`);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch featured articles (status = 1, sorted by created_at)
 */
export function useFeaturedArticles(limit = 5) {
  return useArticles({
    status: 1,
    limit,
    sortBy: 'created_at',
    sortOrder: 'desc',
  });
}

