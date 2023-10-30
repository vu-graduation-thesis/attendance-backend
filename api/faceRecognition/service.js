import axios from "axios";
import FormData from "form-data";
import config from "../../config.js";
import LessonModel from "../../database/lesson.js";
import StudentModel from "../../database/student.js";
import CustomException from "../../exceptions/customException.js";
import logger from "../../utils/logger.js";
import fs from "fs";
import awsUtil from "../../utils/aws.js";

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
    const form = new FormData();
    form.append("file", fs.createReadStream(file.path));
    const response = await axios.post(
      `${config.faceRecognitionServiceUrl}/api/recognize/image`,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    logger.info(
      `Recognize and update attendace for lesson ${lessonId}, filename ${
        file.key
      } successfully, response ${JSON.stringify(response.data)}`
    );

    const studentIds = response.data?.predict?.map((result) => result.label);

    // Get students and lesson info
    const [students, lesson] = await Promise.all([
      StudentModel.find({
        studentId: {
          $in: studentIds,
        },
      }),
      LessonModel.findById(lessonId),
    ]);

    // Create attendances
    const attendance =
      students?.map((student) => ({
        student: student._id,
        type: "AI_DETECTED",
      })) || [];

    // Remove duplicate attendance
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
          resource: {
            bucket,
            folder,
          },
        },
      },
      {
        new: true,
      }
    );
    return {
      doc: result,
      predict: response.data?.predict,
      output: response.data?.output,
    };
  } catch (error) {
    logger.error(
      `Recognize and update attendace for lesson ${lessonId} failed ${error}}`
    );
    throw new CustomException(400, "Recognize and update attendace error");
  }
};

const downloadFile = async (url, path) => {
  try {
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "stream",
    });

    const writeStream = fs.createWriteStream(path);
    response.data.pipe(writeStream);

    return new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
  } catch (error) {
    console.log(error.message);
  }
};

const uploadFilesToS3 = async ({ files, bucket, folder }) => {
  logger.info(`Upload files to s3 bucket ${bucket}, folder ${folder}`);
  const localPath = `./uploads/DETECTED_${files.detected}`;
  await downloadFile(
    config.faceRecognitionServiceUrl + `/api/download/${files.detected}`,
    localPath
  );
  await awsUtil.uploadFilesToS3(
    [
      {
        filename: `ORIGIN_${files.original?.originalname}`,
        buffer: fs.readFileSync(files.original?.path),
      },
      {
        filename: `DETECTED_${files.detected}`,
        buffer: fs.readFileSync(localPath),
      },
    ],
    bucket,
    folder
  );

  fs.unlinkSync(files.original?.path);
  fs.unlinkSync(localPath);
  logger.info(`Remove local files ${files.original?.path}, ${localPath}`);
};

export default { training, recognizeAndUpdateAttendance, uploadFilesToS3 };
