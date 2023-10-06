import mongoose, { Mongoose } from "mongoose";
import ClassModel from "../../database/class.js";
import LessonModel from "../../database/lesson.js";
import logger from "../../utils/logger.js";
import { DateTime } from "luxon";

const getAllClasses = async () => {
  const classes = await ClassModel.find({})
    .populate("teacher")
    .populate("subject")
    .populate("students")
    .populate("createdBy");
  logger.info(
    `Get all classes successfully - ${
      classes.length
    } classes - ${JSON.stringify(classes)}`
  );
  return classes;
};

const getClassById = async (id) => {
  const [_class, lessons] = await Promise.all([
    ClassModel.findById(id)
      .populate("teacher")
      .populate("subject")
      .populate("students")
      .populate("createdBy"),
    LessonModel.find({
      class: id,
    }).populate("classroom"),
  ]);
  _class._doc.lessons = lessons;

  logger.info(`Get class by id successfully - ${JSON.stringify(_class)}`);
  return _class;
};

const addClass = async (_class, createdBy) => {
  logger.info(`Start init class with data - ${JSON.stringify(_class)}`);
  const newClass = await ClassModel.create({
    ..._class,
    createdBy: new mongoose.Types.ObjectId(createdBy),
    teacher: new mongoose.Types.ObjectId(_class.teacher),
    subject: new mongoose.Types.ObjectId(_class.subject),
  });

  if (newClass?.totalNumberOfLessons && _class?.lessonSchedules) {
    const lessons = [];
    let schedulePointer = 0;
    while (lessons.length < newClass.totalNumberOfLessons) {
      const schedule = _class?.lessonSchedules?.[schedulePointer];
      const date = DateTime.fromFormat(schedule.startDay, "dd/MM/yyyy")
        .setZone("Asia/Ho_Chi_Minh")
        .plus({ days: lessons.length * 7 });
      lessons.push({
        classroom: new mongoose.Types.ObjectId(schedule?.classroom),
        session: schedule.session,
        class: new mongoose.Types.ObjectId(newClass._id),
        lessons: schedule.lessons,
        lessonDay: date.toISO(),
      });
      schedulePointer++;
      if (schedulePointer >= _class?.lessonSchedules?.length) {
        schedulePointer = 0;
      }
    }
    await LessonModel.insertMany(lessons);
  }

  return newClass;
};

const updateClass = async (id, _class) => {
  _class.teacher &&
    (_class.teacher = new mongoose.Types.ObjectId(_class.teacher));

  _class.subject &&
    (_class.subject = new mongoose.Types.ObjectId(_class.subject));

  _class.students &&
    (_class.students = _class.students.map((student) => {
      return new mongoose.Types.ObjectId(student);
    }));

  _class.createdBy &&
    (_class.createdBy = new mongoose.Types.ObjectId(_class.createdBy));

  const updatedClass = await ClassModel.findByIdAndUpdate(id, _class, {
    new: true,
  });
  logger.info(`Update class successfully - ${JSON.stringify(updatedClass)}`);
  return updatedClass;
};

export default { getAllClasses, addClass, updateClass, getClassById };
