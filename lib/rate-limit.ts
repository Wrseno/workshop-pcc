import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a Redis instance using environment variables
// If not configured, it will use in-memory fallback (for development)
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// Create rate limiter instances for different use cases

// For login attempts - stricter limit
export const loginRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 attempts per 15 minutes
      analytics: true,
      prefix: "@upstash/ratelimit/login",
    })
  : null;

// For general API requests - more lenient
export const apiRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "1 m"), // 30 requests per minute
      analytics: true,
      prefix: "@upstash/ratelimit/api",
    })
  : null;

// For registration - prevent spam
export const registrationRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 registrations per hour
      analytics: true,
      prefix: "@upstash/ratelimit/registration",
    })
  : null;

// Helper function to get client identifier (IP address)
export async function getClientIdentifier(request: Request): Promise<string> {
  // Try to get real IP from various headers (for production behind proxies)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback to a default identifier for development
  return "development-client";
}

// In-memory fallback for development (when Redis is not configured)
const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(
  identifier: string,
  limit: number = 30,
  window: number = 60000 // 1 minute in ms
): Promise<{ success: boolean; remaining?: number }> {
  // If Redis is configured, use the proper rate limiters
  if (redis) {
    return { success: true }; // Will be handled by specific rate limiters
  }

  // In-memory fallback for development
  const now = Date.now();
  const record = inMemoryStore.get(identifier);

  if (!record || now > record.resetAt) {
    inMemoryStore.set(identifier, { count: 1, resetAt: now + window });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  return { success: true, remaining: limit - record.count };
}
