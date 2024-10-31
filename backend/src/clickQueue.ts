import redis from "./redis";

export const enqueueClick = async (clickData: any) => {
  await redis.rpush("clickQueue", JSON.stringify(clickData));
};

export const processClickQueue = async () => {
  const task = await redis.lpop("clickQueue");
  if (task) {
    const clickData = JSON.parse(task);
    // Process click data, e.g., update databases or perform analytics
    console.log("Processing click:", clickData);
  }
};
