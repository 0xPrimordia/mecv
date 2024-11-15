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
        retryStrategy(times) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        tls: {
          rejectUnauthorized: true,
          ca: process.env.REDIS_CA_CERT
        }
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
        removeOnComplete: {
          age: 24 * 3600, // Keep completed jobs for 24 hours
          count: 1000     // Keep last 1000 completed jobs
        },
        removeOnFail: {
          age: 24 * 3600  // Keep failed jobs for 24 hours
        }
      },
    });
  } catch (error) {
    console.error(`Queue initialization error for ${name}:`, error);
    throw error;
  }
} 