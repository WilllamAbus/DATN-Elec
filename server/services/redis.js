require("dotenv").config();
const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisClient.on("connect", () => {
  console.log("Kết nối Redis thành công!");
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Không thể kết nối Redis:", err);
  }
})();

module.exports = redisClient;
