import { Redis } from 'ioredis';

// Ensure connection is reused
let redis: Redis | null = null;

export function getRedisClient() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL as string);
  }
  return redis;
}

export function getQueue(name: string) {
  const { Queue } = require('bullmq');
  return new Queue(name, { connection: getRedisClient() });
} 