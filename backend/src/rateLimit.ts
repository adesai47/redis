import { Request, Response, NextFunction } from "express";
import redis from "./redisClient";

const MAX_CLICKS = 10;
const WINDOW_TIME = 10 * 1000; // 10 seconds

export const rateLimit = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.ip; // Using IP as identifier; replace as needed for specific user ID
  const key = `rate-limit:${userId}`;
  
  const now = Date.now();
  
  // Start a transaction
  const transaction = redis.multi();
  transaction.zadd(key, now, now.toString());
  transaction.zremrangebyscore(key, 0, now - WINDOW_TIME);
  transaction.zcard(key);

  const [_, __, count] = await transaction.exec();
  
  if (count > MAX_CLICKS) {
    return res.status(429).json({ message: "Rate limit exceeded. Try again later." });
  }

  next();
};
