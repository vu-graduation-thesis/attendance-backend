import mongoose from "mongoose";
import LessonModel from "../../database/lesson.js";
import logger from "../../utils/logger.js";
import { DateTime } from "luxon";

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
      populate: {
        path: "teacher",
        model: "teachers",
        select: "name",
      },
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

export default { getLessons, updateLesson };
