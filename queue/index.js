import Queue from "bull";
import redis from "redis";
import config from "../config.js";

const redisClient = redis.createClient({
  password: config.redis.password,
  socket: {
    host: config.redis.host,
    port: config.redis.host
  }
});

(async () => {
  await redisClient.connect().catch(console.error);
})()

const messageQueue = new Queue("message", {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
  }
});

export { redisClient }
export default messageQueue;
