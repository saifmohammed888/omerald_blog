import { readFileSync } from 'fs';
import { join } from 'path';
import type { Article } from '@/lib/types/article';
import type { HealthTopic } from '@/lib/types/topic';
import type { ArticleWithRelations } from '@/lib/types/article';

let cachedArticles: Article[] | null = null;
let cachedTopics: HealthTopic[] | null = null;

/**
 * Load dummy articles from JSON file
 */
export function getDummyArticles(): Article[] {
  if (cachedArticles) return cachedArticles;
  
  try {
    const articlesPath = join(process.cwd(), 'data/dummy/articles.json');
    const articlesData = JSON.parse(readFileSync(articlesPath, 'utf-8'));
    cachedArticles = articlesData.map((article: any) => ({
      ...article,
      created_at: new Date(article.created_at),
      updated_at: new Date(article.updated_at),
      approval_date: article.approval_date ? new Date(article.approval_date) : null,
    }));
    return cachedArticles || [];
  } catch (error) {
    console.error('Error loading dummy articles:', error);
    return [];
  }
}

/**
 * Load dummy topics from JSON file
 */
export function getDummyTopics(): HealthTopic[] {
  if (cachedTopics) return cachedTopics;
  
  try {
    const topicsPath = join(process.cwd(), 'data/dummy/health-topics.json');
    const topicsData = JSON.parse(readFileSync(topicsPath, 'utf-8'));
    cachedTopics = topicsData.map((topic: any) => ({
      ...topic,
      created_at: new Date(),
      updated_at: new Date(),
    }));
    return cachedTopics || [];
  } catch (error) {
    console.error('Error loading dummy topics:', error);
    return [];
  }
}

/**
 * Get articles with topics populated from dummy data
 */
export function getDummyArticlesWithTopics(): ArticleWithRelations[] {
  const articles = getDummyArticles();
  const topics = getDummyTopics();
  
  return articles.map((article) => {
    const topicIds = article.health_topics
      ? article.health_topics.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))
      : [];
    
    const articleTopics = topics.filter(topic => topicIds.includes(topic.id));
    
    return {
      ...article,
      topics: articleTopics,
    };
  });
}

/**
 * Get topics with article counts from dummy data
 */
export function getDummyTopicsWithCounts() {
  const articles = getDummyArticles();
  const topics = getDummyTopics();
  
  return topics.map((topic) => {
    const articleCount = articles.filter(article => {
      if (!article.health_topics) return false;
      const topicIds = article.health_topics.split(',').map(id => parseInt(id.trim()));
      return topicIds.includes(topic.id);
    }).length;
    
    return {
      ...topic,
      articleCount,
    };
  });
}

