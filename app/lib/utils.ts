/**
 * Get the base URL for API calls
 * Works in both development and production (Vercel)
 */
export function getBaseUrl(): string {
  // In production on Vercel, VERCEL_URL is automatically set
  // Format: your-app.vercel.app (without https://)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // Also check VERCEL (for preview deployments)
  if (process.env.VERCEL) {
    // VERCEL_URL should be set, but if not, construct from VERCEL env
    // This is a fallback
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`
    }
  }
  
  // Use NEXT_PUBLIC_API_URL if explicitly set
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  
  // For local development
  return 'http://localhost:3000'
}

/**
 * Get health topic name from ID
 * @param healthTopics Array of health topics with id and title
 * @param topicId Health topic ID (can be string or number)
 * @returns Health topic name or fallback text
 */
export function getHealthTopicName(healthTopics: any[], topicId: string | number): string {
  if (!topicId) return 'Health & Wellness'
  const id = typeof topicId === 'string' ? parseInt(topicId.trim(), 10) : topicId
  if (isNaN(id)) return String(topicId)
  const topic = healthTopics.find((t: any) => t.id === id)
  return topic?.title || 'Health & Wellness'
}

