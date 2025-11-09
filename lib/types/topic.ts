/**
 * Health Topic type definition
 */
export interface HealthTopic {
  id: number;
  name?: string;
  title?: string;
  slug: string;
  description?: string | null;
  body?: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Health Topic with article count
 */
export interface HealthTopicWithCount extends HealthTopic {
  articleCount: number;
}

