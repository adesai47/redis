import { Request, Response } from "express";
import redis from "./redisClient";

const GLOBAL_CLICK_COUNT = "global:clickCount";

export const handleClick = async (req: Request, res: Response) => {
  // Increment the global click count
  const newCount = await redis.incr(GLOBAL_CLICK_COUNT);
  
  res.json({ message: "Click registered", totalClicks: newCount });
};
