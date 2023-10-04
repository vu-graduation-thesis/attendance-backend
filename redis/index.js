import Queue from "bull";
import redis from "redis";

import config from "../config.js";

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
      console.log("Redis connected");
    })
    .catch(console.error);

  const subscriber = redisClient.duplicate();

  await subscriber.connect();

  await subscriber.subscribe("training_data", message => {
    console.log(message);
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
