import mongoose from "mongoose";
import TeacherModel from "../../database/teacher.js";
import AccountRepository from "../../repositories/account.js";
import {
  EXISTED_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  TEACHER_ROLE,
} from "../../utils/constant.js";
import logger from "../../utils/logger.js";
import AccountModel from "../../database/account.js";
import crypt from "../../utils/crypt.js";
import CustomException from "../../exceptions/customException.js";
import mailUtils from "../../utils/mail/index.js";
import config from "../../config.js";
import fs from "fs";
import csvParser from "csv-parser";

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
    $or: [
      {
        username: teacher?.username,
      },
      {
        email: teacher?.email,
      },
    ],
  });
  if (existedTeacher) {
    throw new CustomException(400, "Username existed", EXISTED_ERROR_CODE, {
      email: existedStudent?.email === payload.email,
      username: existedStudent?.username === payload.username,
    });
  }
  const newTeacher = await TeacherModel.create({
    ...(teacher.teacher || {}),
    createdBy: new mongoose.Types.ObjectId(createdBy),
  });

  teacher.password = teacher.password || crypt.generateRandomPassword();

  const newAccount = await AccountModel.create({
    ...teacher,
    role: TEACHER_ROLE,
    teacher: newTeacher._id,
    password: crypt.bcryptHash(teacher.password),
  });

  const subject = "Thông tin tài khoản giảng viên mới";
  mailUtils.send("new_teacher_account", teacher.email, subject, {
    link: config.domain,
    username: teacher.username,
    password: teacher.password,
  });

  logger.info(`Add teacher successfully - ${JSON.stringify(newTeacher)}`);
  return newAccount;
};

const updateTeacher = async (id, data = {}) => {
  const account = await AccountRepository.findOne({ _id: id });
  if (!account) {
    throw new CustomException(400, "Teacher not found", NOT_FOUND_ERROR_CODE);
  }

  const teacher = data?.teacher || {};
  data.teacher = undefined;

  await Promise.all([
    TeacherModel.updateOne(
      { _id: account.teacher._id },
      {
        $set: teacher,
      }
    ),
    AccountModel.updateOne(
      { _id: id },
      {
        $set: {
          ...(data || {}),
        },
      }
    ),
  ]);

  logger.info(`Update teacher successfully - payload ${JSON.stringify(data)}`);
};

const batchUpload = async (file, createdBy) => {
  const result = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(file.path)
      .pipe(csvParser())
      .on("data", async (row) => {
        const data = {
          username:
            row["Mã giảng viên"] || row["Email"] || row["Số điện thoại"],
          phone: row["Số điện thoại"],
          email: row["Email"],
          teacher: {
            name: row["Họ tên"],
            email: row["Email"],
            address: row["Địa chỉ"],
          },
          createdBy,
        };
        try {
          await addTeacher(data, createdBy);
          result.push({
            status: "success",
            data,
          });
        } catch (err) {
          logger.error(
            `Error when batch upload teacher ${data?.username} - ${err}`
          );
          result.push({
            status: "error",
            data,
            error: err,
          });
        }
      })
      .on("end", async () => {
        logger.info(`Batch upload teacher successfully - ${result.length}`);
        setTimeout(() => {
          resolve(result);
        }, 500);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

export default { getAllTeachers, addTeacher, updateTeacher, batchUpload };
