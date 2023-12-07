import mongoose from "mongoose";
import ClassModel from "../../database/class.js";
import LessonModel from "../../database/lesson.js";
import logger from "../../utils/logger.js";
import LessonRepository from "../../repositories/lesson.js";
import { createObjectCsvWriter } from "csv-writer";
import fs from "fs";
import { DateTime } from "luxon"

const getAllClasses = async (filter) => {
  logger.info(`Start get all classes with filter - ${JSON.stringify(filter)}`);
  const classes = await ClassModel.find({
    isDeleted: {
      $ne: true,
    },
    ...(filter || {}),
  })
    .populate("teacher")
    .populate("subject")
    .populate("students")
    .populate("createdBy");
  logger.info(
    `Get all classes successfully with filer - ${JSON.stringify(filter)} - ${classes.length
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
      .populate("createdBy")
      .lean(),
    LessonModel.find({
      class: id,
    })
      .populate("classroom")
      .lean(),
  ]);
  _class.lessons = lessons;

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

  await LessonRepository.initLessonSchedule(
    newClass._id,
    _class.lessonSchedules,
    _class.totalNumberOfLessons
  );

  logger.info(`Add class successfully - ${JSON.stringify(newClass)}`);
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

  // await LessonRepository.initLessonSchedule(
  //   id,
  //   _class.lessonSchedules,
  //   _class.totalNumberOfLessons
  // );

  logger.info(`Update class successfully - ${JSON.stringify(updatedClass)}`);
  return updatedClass;
};

const exportAttendance = async (id) => {
  const _class = await ClassModel.findById(id)
    .populate("teacher")
    .populate("subject")
    .populate("students")
    .populate("createdBy")
    .lean();

  const lessons = await LessonModel.find({
    class: _class._id,
  }).lean();

  const students = _class?.students?.map((student) => {
    const attendanceCount = lessons?.reduce((count, lesson) => {
      const attendance = lesson.attendances.some(
        (attendance) =>
          attendance?.student?.toHexString() === student?._id?.toHexString()
      );
      if (attendance) {
        count++;
      }
      return count;
    }, 0);

    return {
      ...student,
      birthday: DateTime.fromJSDate(student?.birthday).toFormat("dd/MM/yyyy"),
      attendanceCount,
    };
  });

  if (!fs.existsSync(`${__dirname}/exports`)) {
    fs.mkdirSync(`${__dirname}/exports`);
  }

  const csvWriter = createObjectCsvWriter({
    path: `${__dirname}/exports/${_class?.name}.csv`,
    header: [
      { id: "studentId", title: "Mã sinh viên" },
      { id: "name", title: "Họ tên" },
      { id: "birthday", title: "Ngày sinh" },
      { id: "administrativeClass", title: "Lớp" },
      { id: "email", title: "Email" },
      { id: "verified", title: "Đã xác thực" },
      { id: "attendanceCount", title: "Số buổi đi học" },
    ],
  });

  await csvWriter?.writeRecords(students);
  return {
    path: `${__dirname}/exports/${_class?.name}.csv`,
    filename: `${_class?.name}.csv`,
  };
};

export default {
  getAllClasses,
  addClass,
  updateClass,
  getClassById,
  exportAttendance,
};
