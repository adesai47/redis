import express from "express";
import redis from "./redis";
import { rateLimiter } from "./rateLimiter";
import { incrementClickCount, getClickCount } from "./clickCounter";
import { enqueueClick } from "./clickQueue";

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  const clickCount = await getClickCount();
  res.json({ globalClickCount: clickCount });
});

app.post("/click", async (req, res) => {
  const userId = req.body.userId;
  
  // Rate limiting check
  const allowed = await rateLimiter(userId);
  if (!allowed) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  // Enqueue the click and increment global counter
  await enqueueClick({ userId, timestamp: Date.now() });
  await incrementClickCount();

  res.status(200).json({ message: "Click registered!" });
});

app.listen(3012, () => {
  console.log("Server is running on port 3012");
});