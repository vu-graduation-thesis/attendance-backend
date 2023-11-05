import LessonModel from "../database/lesson.js";
import { DateTime } from "luxon";
import mongoose from "mongoose";

const initLessonSchedule = (classId, lessonSchedules, totalNumberOfLessons) => {
  if (!totalNumberOfLessons || !lessonSchedules?.length) return;
  const lessons = [];
  let schedulePointer = 0;
  while (lessons.length < totalNumberOfLessons) {
    const schedule = lessonSchedules?.[schedulePointer];
    // missing case: schedules is same week
    const date = DateTime.fromFormat(schedule.startDay, "dd/MM/yyyy")
      .setZone("Asia/Ho_Chi_Minh")
      .plus({ days: lessons.length * 7 });
    lessons.push({
      classroom: new mongoose.Types.ObjectId(schedule?.classroom),
      session: schedule.session,
      class: new mongoose.Types.ObjectId(classId),
      lessons: schedule.lessons,
      lessonDay: date.toISO(),
      order: lessons.length + 1,
    });
    schedulePointer++;
    if (schedulePointer >= lessonSchedules?.length) {
      schedulePointer = 0;
    }
  }
  return LessonModel.insertMany(lessons);
};

export default { initLessonSchedule };
