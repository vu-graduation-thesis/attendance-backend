import service from "./service.js";

const recognize = async (req, res) => {
  const { lessonId, bucket, folder, file } = req;
  const result = await service.recognizeAndUpdateAttendance({
    lessonId,
    bucket,
    folder,
    file,
  });
  res.json(result);
};

const training = async (req, res) => {
  const { user, bucket, folder } = req;
  service.training(user?.identity, bucket, folder);

  res.json({
    message: "Push training action successfully.",
  });
};

export { training, recognize };
