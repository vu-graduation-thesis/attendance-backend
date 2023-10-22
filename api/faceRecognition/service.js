import config from "../../config";

const training = async (studentId, bucket, files) => {
  const response = await axios.post(
    `${config.faceRecognitionServiceUrl}/api/training/${studentId}`,
    {
      bucket: files[0].bucket,
      folder_path: files[0].key.split("/")[0],
    }
  );
};

export { training };
