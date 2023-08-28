import Queue from "bull";
import redis from "redis";

const redisClient = new redis({
  host: "your-redis-host",
  port: 6379,
  password: "your-redis-password",
});

const messageQueue = new Queue("message", {
  createClient: () => redisClient,
});

export default messageQueue;
