import logger from "../../utils/logger.js";
import CustomException from "../../exceptions/customException.js";
import AttendanceLogModel from "../../database/attendanceLog.js";

const findAttendanceLogs = async ({ lessonId }) => {
  logger.info(`Find attendance logs for lesson ${lessonId}`);
  const log = await AttendanceLogModel.findOne({
    lessonId,
  }).populate({
    path: "createdBy",
    populate: [
      {
        path: "teacher",
        model: "teachers",
        select: "name",
      },
    ],
  });

  logger.info(
    `Find attendance logs for lesson ${lessonId} - ${JSON.stringify(
      log
    )} successfully`
  );
  return log;
};

export default { findAttendanceLogs };
