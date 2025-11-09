import type { HealthTopic } from './topic';

/**
 * Article status enum
 */
export enum ArticleStatus {
  APPROVED = 1,
  SUBMITTED = 2,
  IN_DRAFT = 3,
  REJECTED = 4,
}

/**
 * Article type definition
 */
export interface Article {
  id: number;
  writer_id: number;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  health_topics: string | null; // Comma-separated topic IDs or names
  article_comment: string | null;
  article_ratings: string | null;
  status: ArticleStatus;
  image: string | null;
  updated_by: number | null;
  approval_date: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Article with related data
 */
export interface ArticleWithRelations extends Article {
  writer?: {
    id: number;
    name: string;
    profile_picture?: string;
  };
  topics?: HealthTopic[];
}

/**
 * Article list query parameters
 */
export interface ArticleListParams {
  page?: number;
  limit?: number;
  search?: string;
  topic?: string;
  status?: ArticleStatus;
  sortBy?: 'created_at' | 'updated_at' | 'title';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Article list response
 */
export interface ArticleListResponse {
  articles: ArticleWithRelations[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

