import axios from "axios";
import redis from "../../redis/index.js";
import config from "../../config.js";
import service from "./service.js";

const { messageQueue } = redis;

const detectAllFaces = async (req, res) => {
  const form = new FormData();
  form.append("image", req.file);
  const response = await axios.post(
    `${config.faceRecognitionServiceUrl}/api/face-detect`,
    {}
  );
};

const training = async (req, res) => {
  service.training(req.user?.student?.studentId, req.files);

  res.json({
    message: "Push training action successfully.",
  });
};

export { training };
