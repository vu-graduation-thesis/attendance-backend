import Queue from "bull";
import redis from "redis";

import config from "../config.js";
import logger from "../utils/logger.js";

const redisClient = redis.createClient({
  password: config.redis.password,
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
});

(async () => {
  await redisClient
    .connect()
    .then(() => {
      logger.info("Redis connected");
    })
    .catch((error) => {
      logger.error("Error connecting to Redis:", error);
    });

  const subscriber = redisClient.duplicate();

  await subscriber.connect();

  await subscriber.subscribe("training_data", (message) => {
    logger.info(`Received message in training_data queue: ${message}`);
  });
})();

const messageQueue = new Queue("message", {
  redis: {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
  },
});

export default { redisClient, messageQueue };
