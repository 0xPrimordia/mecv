import { Redis } from 'ioredis';
import { Queue } from 'bullmq';

let redis: Redis | null = null;

export function getRedisClient() {
  if (!redis) {
    if (!process.env.REDIS_URL) {
      throw new Error('REDIS_URL environment variable is not set');
    }
    
    try {
      redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      });
      
      redis.on('error', (error) => {
        console.error('Redis connection error:', error);
      });
      
      redis.on('connect', () => {
        console.log('Redis connected successfully');
      });
    } catch (error) {
      console.error('Redis initialization error:', error);
      throw error;
    }
  }
  return redis;
}

export function getQueue(name: string) {
  try {
    return new Queue(name, {
      connection: getRedisClient(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    });
  } catch (error) {
    console.error(`Queue initialization error for ${name}:`, error);
    throw error;
  }
} 