import mongoose from "mongoose";
import ClassModel from "../../database/class.js";
import logger from "../../utils/logger.js";

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

const addClass = async (_class, createdBy) => {
  console.log(createdBy);
  const newClass = await ClassModel.create({
    ..._class,
    createdBy: new mongoose.Types.ObjectId(createdBy),
    teacher: new mongoose.Types.ObjectId(_class.teacher),
    subject: new mongoose.Types.ObjectId(_class.subject),
  });
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

export default { getAllClasses, addClass, updateClass };
