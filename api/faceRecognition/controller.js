import redis from "../../redis/index.js";

const { messageQueue } = redis;

const training = async (req, res) => {
  messageQueue.add({
    userId: "123456",
    action: "START_TRAINING_MODEL",
  });

  res.json({
    message: "Push action successfully.",
  });
};

export { training };
