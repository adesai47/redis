import redis from "./redis";

export const rateLimiter = async (userId: string): Promise<boolean> => {
  const key = `rate_limit:${userId}`;
  const currentTime = Date.now();
  
  // Start a pipeline to increment click count and check expiration
  const pipeline = redis.multi();
  pipeline.zadd(key, currentTime, `${currentTime}`);
  pipeline.zremrangebyscore(key, 0, currentTime - 10000);
  pipeline.zcard(key);

  const [, , clickCount] = await pipeline.exec();

  // If clickCount exceeds 10, rate limit
  if (clickCount > 10) {
    return false;
  }

  // Set expiration of 10 seconds for the key
  await redis.expire(key, 10);
  return true;
};
