import redis from "./redis";

export const incrementClickCount = async () => {
  await redis.incr("global_click_count");
};

export const getClickCount = async (): Promise<number> => {
  const count = await redis.get("global_click_count");
  return count ? parseInt(count, 10) : 0;
};
