import mongoose from "mongoose";
import TeacherModel from "../../database/teacher.js";
import AccountRepository from "../../repositories/account.js";
import { TEACHER_ROLE } from "../../utils/constant.js";
import logger from "../../utils/logger.js";
import AccountModel from "../../database/account.js";
import crypt from "../../utils/crypt.js";

const getAllTeachers = async () => {
  let teachers = await AccountRepository.find({
    role: TEACHER_ROLE,
    isDeleted: { $ne: true },
  });
  logger.info(
    `Get all teachers successfully - ${
      teachers.length
    } teachers - ${JSON.stringify(teachers)}`
  );
  return teachers;
};

const addTeacher = async (teacher, createdBy) => {
  const existedTeacher = await AccountModel.findOne({
    username: teacher.username,
  });
  if (existedTeacher) {
    throw new CustomException(400, "Username existed", EXISTED_ERROR_CODE);
  }
  const newTeacher = await TeacherModel.create({
    ...teacher,
    createdBy: new mongoose.Types.ObjectId(createdBy),
  });

  const newAccount = await AccountModel.create({
    ...teacher,
    role: TEACHER_ROLE,
    teacher: newTeacher._id,
    password: crypt.bcryptHash(teacher.password),
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
