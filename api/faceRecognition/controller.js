import axios from "axios";
import redis from "../../redis/index.js";
import config from "../../config.js";

const { messageQueue } = redis;

const detectAllFaces = async (req, res) => {
  const form = new FormData();
  form.append('image', req.file)
  const response = await axios.post(`${config.faceRecognitionServiceUrl}/api/face-detect`, {

  })
}

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
