import mongoose from "mongoose";
import TeacherModel from "../../database/teacher.js";
import AccountRepository from "../../repositories/account.js";
import { TEACHER_ROLE } from "../../utils/constant.js";
import logger from "../../utils/logger.js";
import AccountModel from "../../database/account.js";

const getAllTeachers = async () => {
  const teachers = await AccountRepository.find({ role: TEACHER_ROLE });
  logger.info(
    `Get all teachers successfully - ${
      teachers.length
    } teachers - ${JSON.stringify(teachers)}`
  );
  return teachers;
};

const addTeacher = async (teacher, createdBy) => {
  const newTeacher = await TeacherModel.create({
    ...teacher,
    createdBy: new mongoose.Types.ObjectId(createdBy),
  });

  const newAccount = await AccountModel.create({
    ...teacher,
    role: TEACHER_ROLE,
    teacher: newTeacher._id,
  });
  logger.info(`Add teacher successfully - ${JSON.stringify(newTeacher)}`);
  return newAccount;
};

const updateTeacher = async (id, teacher) => {
  const updatedTeacher = await TeacherModel.findByIdAndUpdate(id, teacher, {
    new: true,
  });
  logger.info(
    `Update teacher successfully - ${JSON.stringify(updatedTeacher)}`
  );
  return updatedTeacher;
};

export default { getAllTeachers, addTeacher, updateTeacher };
