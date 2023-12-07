import service from "./service.js";
import studentService from "../students/service.js";
import CustomException from "../../exceptions/customException.js";
import { EXPIRED_TIME_ERROR } from "../../utils/constant.js";

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

const recognizeImageStudentUpload = async (req, res) => {
  const { lessonId } = req.params;
  const result = await service.checkLessonAttendanceValid(lessonId);
  // get long lat in form data
  await service.checkDistance({
    lessonId,
    studentLocation: {
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    },
  });

  if (result) {
    await recognize(req, res);
  } else {
    throw new CustomException(
      400,
      "Lesson attendance is not valid",
      EXPIRED_TIME_ERROR
    );
  }
};

const training = async (req, res) => {
  const { user, bucket, folder, files } = req;

  service.training({ studentId: user?.identity, bucket, folder, files });
  studentService.updateStudent(user?._id, {
    student: {
      avatar: `${folder}/${files?.[0]?.originalname}`,
    },
  });

  res.json({
    message: "Push training action successfully.",
  });
};

export { training, recognize, recognizeImageStudentUpload };
