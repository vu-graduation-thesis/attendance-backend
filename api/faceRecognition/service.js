import axios from "axios";
import config from "../../config.js";
import LessonModel from "../../database/lesson.js";
import StudentModel from "../../database/student.js";
import CustomException from "../../exceptions/customException.js";
import logger from "../../utils/logger.js";

const training = async (studentId, bucket, folder) => {
  try {
    logger.info(
      `Push training action for student ${studentId}, bucket ${bucket}, folder ${folder}`
    );
    const response = await axios.post(
      `${config.faceRecognitionServiceUrl}/api/training/${studentId}`,
      {
        bucket,
        folder_path: folder,
      }
    );
    logger.info(
      `Push training action for student ${studentId}, bucket ${bucket}, folder ${folder} successfully, response ${JSON.stringify(
        response.data
      )}`
    );
    await StudentModel.updateOne(
      {
        studentId,
      },
      {
        $set: {
          verified: true,
          verifiedAt: new Date(),
          verifiedResourse: {
            bucket,
            folder,
          },
        },
      }
    );
    logger.info(
      `Update student ${studentId} verified status to true successfully`
    );
  } catch (error) {
    logger.error(
      `Push training action for student ${studentId} bucket ${bucket} folder ${folder} failed, error ${JSON.stringify(
        error
      )}`
    );
  }
};

const recognizeAndUpdateAttendance = async ({
  lessonId,
  bucket,
  folder,
  file,
}) => {
  logger.info(`Recognize and update attendace for lesson ${lessonId}`);
  try {
    const response = await axios.post(
      `${config.faceRecognitionServiceUrl}/api/recognize`,
      {
        file: file.key,
        bucket,
        type: file.contentType?.includes("image") ? "image" : "video",
      }
    );

    logger.info(
      `Recognize and update attendace for lesson ${lessonId}, filename ${
        file.key
      } successfully, response ${JSON.stringify(response.data)}`
    );

    const studentIds = response.data?.map((result) => result.label);
    const [students, lesson] = await Promise.all([
      StudentModel.find({
        studentId: {
          $in: studentIds,
        },
      }),
      LessonModel.findById(lessonId),
    ]);
    const attendance =
      students?.map((student) => ({
        student: student._id,
        type: "AI_DETECTED",
      })) || [];

    const uniqueAttendance = attendance.reduce((acc, current) => {
      const x = acc.find(
        (item) => item.student.toHexString() === current.student.toHexString()
      );
      if (!x) {
        acc.push(current);
      }
      return acc;
    }, lesson.attendances || []);

    const result = await LessonModel.findOneAndUpdate(
      {
        _id: lessonId,
      },
      {
        $set: {
          attendances: uniqueAttendance,
        },
      },
      {
        new: true,
      }
    );
    return result;
  } catch (error) {
    logger.error(
      `Recognize and update attendace for lesson ${lessonId} failed ${error}}`
    );
    throw new CustomException(400, "Recognize and update attendace error");
  }
};

export default { training, recognizeAndUpdateAttendance };
