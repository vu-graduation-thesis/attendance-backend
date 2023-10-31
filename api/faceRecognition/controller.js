import service from "./service.js";
import studentService from "../students/service.js";

const recognize = async (req, res) => {
  const { lessonId, bucket, folder, file, user } = req;
  const result = await service.recognizeAndUpdateAttendance({
    lessonId,
    bucket,
    folder,
    file,
    createdBy: user?._id,
  });

  service.uploadFilesToS3({
    bucket,
    folder,
    files: {
      original: file,
      detected: result?.output,
    },
  });
  res.json(result);
};

const training = async (req, res) => {
  const { user, bucket, folder, files } = req;
  service.training(user?.identity, bucket, folder);
  studentService.updateStudent(user?._id, {
    student: {
      avatar: files?.[0]?.key,
    },
  });

  res.json({
    message: "Push training action successfully.",
  });
};

export { training, recognize };
