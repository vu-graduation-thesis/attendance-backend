import redis from "../redis/index.js";

const { redisClient } = redis;

const set = (key, value, options) => {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }
  return redisClient.set(key, value, options);
};

const get = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, value) => {
      if (err) reject(err);
      if (value === null) {
        resolve(null);
      }
      try {
        resolve(JSON.parse(value));
      } catch (error) {
        resolve(value);
      }
    });
  });
};

const del = (key) => {
  redisClient.del(key);
};

export default { set, get, del };
