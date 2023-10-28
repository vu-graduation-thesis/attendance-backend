import mongoose from "mongoose";
import LessonModel from "../../database/lesson.js";
import logger from "../../utils/logger.js";
import { DateTime } from "luxon";
import CustomException from "../../exceptions/customException.js";

const getLessons = async ({ start, end }, filter) => {
  const lessonDay = {
    ...(start && { $gte: DateTime.fromISO(start).toISODate() }),
    ...(end && { $lte: end }),
  };

  logger.info(`Filter lesson by ${JSON.stringify(lessonDay)}`);
  const lessons = await LessonModel.find({
    ...(Object.keys(lessonDay).length ? { lessonDay } : {}),
    ...(filter || {}),
  })
    .populate("classroom")
    .populate({
      path: "class",
      populate: [
        {
          path: "teacher",
          model: "teachers",
          select: "name",
        },
        {
          path: "subject",
          model: "subjects",
          select: "name",
        },
        {
          path: "students",
          model: "students",
        },
      ],
    });
  logger.info(
    `Get lessons successfully lessonDay from ${start} to ${end} - data: ${JSON.stringify(
      lessons
    )}`
  );
  return lessons;
};

const updateLesson = async (id, lesson) => {
  const updatedLesson = await LessonModel.findByIdAndUpdate(id, lesson, {
    new: true,
  });
  logger.info(`Update lesson successfully - ${JSON.stringify(updatedLesson)}`);
  return updatedLesson;
};

const manualAttendance = async ({ lessonId, studentId }) => {
  logger.info(`Manual attendance for lesson ${lessonId} student ${studentId}`);
  const lesson = await LessonModel.findById(lessonId);
  if (!lesson) {
    throw new CustomException("Lesson not found", 400, "LESSON_NOT_FOUND");
  }

  const student = lesson.attendances?.some(
    (x) => x.student.toHexString() === studentId
  );
  if (!student) {
    return LessonModel.findByIdAndUpdate(
      lessonId,
      {
        $push: {
          attendances: {
            student: new mongoose.Types.ObjectId(studentId),
            type: "MANUAL",
          },
        },
      },
      {
        new: true,
      }
    );
  }
};

export default { getLessons, updateLesson, manualAttendance };
