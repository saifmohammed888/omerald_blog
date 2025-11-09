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

