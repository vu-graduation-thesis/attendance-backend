import axios from "axios";
import FormData from "form-data";
import config from "../../config.js";
import LessonModel from "../../database/lesson.js";
import StudentModel from "../../database/student.js";
import CustomException from "../../exceptions/customException.js";
import logger from "../../utils/logger.js";
import fs from "fs";
import awsUtil from "../../utils/aws.js";
import {
  requestRecognizeService,
  requestTrainingService,
} from "../../externalServices/faceRecognition.js";
import AttendanceLogModel from "../../database/attendanceLog.js";
import path from "path";
import { getDistance } from 'geolib';
import { DISTANCE_ERROR } from "../../utils/constant.js";


const training = async ({ studentId, bucket, folder, files }) => {
  try {
    logger.info(
      `Push training action for student ${studentId}, bucket ${bucket}, folder ${folder}`
    );
    console.log("studentId", files);
    const response = await requestTrainingService(
      studentId,
      files.map((file) => file.path)
    );
    logger.info(
      `Push training action for student ${studentId}, bucket ${bucket}, folder ${folder} successfully, response ${JSON.stringify(
        response
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

    awsUtil.uploadFilesToS3(
      files.map((file) => ({
        filename: file.originalname,
        buffer: fs.readFileSync(file.path),
      })),
      bucket,
      folder
    );

    fs.unlinkSync(files.original?.path);

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
  createdBy,
}) => {
  logger.info(`Recognize and update attendace for lesson ${lessonId}`);
  try {
    const recognizeResult = await requestRecognizeService(file.path);

    logger.info(
      `Recognize and update attendace for lesson ${lessonId}, filename ${file.key
      } successfully, response ${JSON.stringify(recognizeResult)}`
    );

    // download all faces image
    const requestDownloadAllFaces = recognizeResult?.predict?.map((predict) => {
      const localPath = `./uploads/${predict.imageDetector}`;
      return downloadFile(
        config.faceRecognitionServiceUrl +
        `/api/download/${predict.imageDetector}`,
        localPath
      );
    });

    await Promise.allSettled(requestDownloadAllFaces);


    updateLessonAttendance({
      recognizeResult,
      lessonId,
      bucket,
      folder,
    });

    updateAttendanceLog({
      predict: recognizeResult?.predict,
      lessonId,
      bucket,
      originalFilePath: file.originalname,
      detectedFilePath: recognizeResult?.output,
      createdBy,
    });

    return {
      predict: recognizeResult?.predict,
      output: recognizeResult?.output,
    };
  } catch (error) {
    console.log("error", error);
    logger.error(
      `Recognize and update attendace for lesson ${lessonId} failed ${error}}`
    );
    throw new CustomException(400, "Recognize and update attendace error");
  }
};

const updateLessonAttendance = async ({
  recognizeResult,
  lessonId,
  bucket,
  folder,
}) => {
  try {
    logger.info(
      `Update lesson ${lessonId} attendance, bucket ${bucket}, folder ${folder}, recognizeResult ${JSON.stringify(
        recognizeResult
      )}`
    );
    const studentIds = recognizeResult?.predict?.map((result) => result.label);

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
        imageDetector: `./uploads/${recognizeResult?.predict?.find(x => x.label === student.studentId)?.imageDetector}`,
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
    logger.info(
      `Update lesson ${lessonId} attendance, bucket ${bucket}, folder ${folder}, recognizeResult ${JSON.stringify(
        recognizeResult
      )} successfully`
    );

    return result;
  } catch (error) {
    logger.error(
      `Update lesson ${lessonId} attendance, bucket ${bucket}, folder ${folder}, recognizeResult ${JSON.stringify(
        recognizeResult
      )} failed ${error}`
    );
  }
};

const updateAttendanceLog = async ({
  predict,
  lessonId,
  originalFilePath,
  detectedFilePath,
  createdBy,
  bucket,
}) => {
  await AttendanceLogModel.findOneAndUpdate(
    {
      lessonId: lessonId,
    },
    {
      createdBy,
      $push: {
        logs: {
          originalFile: `${lessonId}/ORIGIN_${originalFilePath}`,
          detectedFile: `${lessonId}/DETECTED_${detectedFilePath}`,
          bucket,
          predict,
        },
      },
    },
    {
      upsert: true,
      new: true,
    }
  );
};

const downloadFile = async (url, savePath) => {
  try {
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "stream",
    });

    const writeStream = fs.createWriteStream(savePath);
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
  try {
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
  } catch (error) {
    logger.error(
      `Upload files to s3 bucket ${bucket}, folder ${folder} failed ${error}`
    );
  }
};

const checkLessonAttendanceValid = async (lessonId) => {
  console.log("checkLessonAttendanceValid", lessonId);
  const lesson = await LessonModel.findOne({
    _id: lessonId,
    endAttendanceSessionTime: {
      $gte: new Date(),
    },
  });

  return !!lesson;
};

const checkDistance = async ({ lessonId, studentLocation }) => {
  const lesson = await LessonModel.findOne({
    _id: lessonId,
    endAttendanceSessionTime: {
      $gte: new Date(),
    },
  });

  if (lesson?.location?.latitude && lesson?.location?.longitude) {
    const distance = getDistance(
      { latitude: lesson?.location?.latitude, longitude: lesson?.location?.longitude },
      { latitude: studentLocation?.latitude, longitude: studentLocation?.longitude }
    );
    if (distance > 30) {
      throw new CustomException(400, "You are too far from the classroom", DISTANCE_ERROR);
    }
  }
  return true;
};

export default {
  training,
  recognizeAndUpdateAttendance,
  uploadFilesToS3,
  checkLessonAttendanceValid,
  checkDistance
};
