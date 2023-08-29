import messageQueue from "../../queue/index.js";

const training = async (req, res) => {
  messageQueue.add({
    userId: "123456",
    action: "START_TRAINING_MODEL"
  })

  res.json({
    message: "Push action successfully.",
  });
};

export { training };
