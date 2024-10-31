import Redis from "ioredis";

const redis = new Redis(); // Uses default localhost:6379, modify for your deployment

export default redis;
