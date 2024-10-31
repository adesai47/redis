import express from "express";
import { rateLimit } from "./rateLimit";
import { handleClick } from "./clickController";

const app = express();
const PORT = process.env.PORT || 3000;

// Route to get global click count
app.get("/click", rateLimit, handleClick);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
