import { redisClient } from '@/config/redis';

export class CacheService {
  private readonly defaultTTL = 180; // 3 minutes
  private readonly CACHE_VERSION = 'v1';

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    try {
      await redisClient.setEx(key, ttl || this.defaultTTL, JSON.stringify(value));
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error(`Cache del error for key ${key}:`, error);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.error(`Cache delPattern error for pattern ${pattern}:`, error);
    }
  }

  // Cache key builders
  getCategoriesKey(): string {
    return `categories:${this.CACHE_VERSION}`;
  }

  getProductKey(slug: string): string {
    return `product:${this.CACHE_VERSION}:${slug}`;
  }

  getProductsKey(categorySlug?: string, page?: number, pageSize?: number, search?: string): string {
    const parts = [`products:${this.CACHE_VERSION}`];
    if (categorySlug) parts.push(categorySlug);
    else parts.push('all');
    if (search) parts.push(`search:${search}`);
    if (page) parts.push(`page:${page}`);
    if (pageSize) parts.push(`size:${pageSize}`);
    return parts.join(':');
  }

  getProductsPatternByCategory(categorySlug: string): string {
    return `products:${this.CACHE_VERSION}:${categorySlug}:*`;
  }

  getProductsPatternAll(): string {
    return `products:${this.CACHE_VERSION}:*`;
  }
}
