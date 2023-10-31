import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import config from "../config.js";

export const requestRecognizeService = async (filePath) => {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  const response = await axios.post(
    `${config.faceRecognitionServiceUrl}/api/recognize/image`,
    form,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
