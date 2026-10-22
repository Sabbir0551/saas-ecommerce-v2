import { Redis } from 'ioredis';

class CacheService {
  private redis: Redis | null = null;
  private memoryCache = new Map<string, { value: string; expiresAt: number }>();
  public isRedisConnected = false;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
    try {
      this.redis = new Redis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        retryStrategy: () => null, // don't spam reconnects if not available locally
      });

      // Handle connection error gracefully to prevent unhandled error event log
      this.redis.on('error', () => {
        this.isRedisConnected = false;
      });

      this.redis.connect()
        .then(() => {
          this.isRedisConnected = true;
          console.log('⚡ [Redis] Successfully connected to Redis server');
        })
        .catch(() => {
          console.warn('⚠️ [Redis] Redis server offline. Falling back to in-memory cache.');
          this.redis = null;
          this.isRedisConnected = false;
        });
    } catch {
      console.warn('⚠️ [Redis] In-memory cache fallback active.');
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.isRedisConnected && this.redis) {
      try {
        return await this.redis.get(key);
      } catch {
        // Fallback to memory
      }
    }
    const item = this.memoryCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ttlSeconds: number = 300): Promise<void> {
    if (this.isRedisConnected && this.redis) {
      try {
        await this.redis.set(key, value, 'EX', ttlSeconds);
        return;
      } catch {
        // Fallback to memory
      }
    }
    this.memoryCache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async del(key: string): Promise<void> {
    if (this.isRedisConnected && this.redis) {
      try {
        await this.redis.del(key);
      } catch {}
    }
    this.memoryCache.delete(key);
  }
}

export const cache = new CacheService();
