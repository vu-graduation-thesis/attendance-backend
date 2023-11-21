import mongoose from "mongoose";
import StudentModel from "../../database/student.js";
import AccountRepository from "../../repositories/account.js";
import {
  EXISTED_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  STUDENT_ROLE,
} from "../../utils/constant.js";
import logger from "../../utils/logger.js";
import AccountModel from "../../database/account.js";
import crypt from "../../utils/crypt.js";
import common from "../../utils/common.js";
import CustomException from "../../exceptions/customException.js";
import awsUtils from "../../utils/aws.js";
import fs from "fs";
import csvParser from "csv-parser";
import mailUtils from "../../utils/mail/index.js";
import config from "../../config.js";

const getAllStudents = async () => {
  let students = await AccountRepository.find({
    role: STUDENT_ROLE,
    isDeleted: {
      $ne: true,
    },
  });
  logger.info(
    `Get all students successfully - ${
      students.length
    } students - ${JSON.stringify(students)}`
  );
  return students;
};

const addStudent = async (payload = {}, createdBy) => {
  const existedStudent = await AccountModel.findOne({
    $or: [
      {
        username: payload.username,
      },
      {
        email: payload.email,
      },
    ],
  });
  if (existedStudent) {
    throw new CustomException(400, "Username existed", EXISTED_ERROR_CODE, {
      email: existedStudent?.email === payload.email,
      username: existedStudent?.username === payload.username,
    });
  }
  const newStudent = await StudentModel.create({
    ...(payload?.student || {}),
    createdBy: new mongoose.Types.ObjectId(createdBy),
  });

  delete payload.student;

  payload.password = crypt.generateRandomPassword();

  await AccountModel.create({
    ...payload,
    role: STUDENT_ROLE,
    student: newStudent._id,
    password: crypt.bcryptHash(payload.password),
  });

  const subject = "Thông tin tài khoản sinh viên mới";
  mailUtils.send("new_student_account", payload.email, subject, {
    link: config.domain,
    username: payload.username,
    password: payload.password,
  });

  logger.info(`Add student successfully - ${JSON.stringify(newStudent)}`);
};

const updateStudent = async (id, data = {}) => {
  const account = await AccountRepository.findOne({ _id: id });
  if (!account) {
    throw new CustomException(400, "Student not found", NOT_FOUND_ERROR_CODE);
  }

  const student = data?.student || {};
  data.student = undefined;

  await Promise.all([
    StudentModel.updateOne(
      { _id: account.student._id },
      {
        $set: student,
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

  logger.info(`Update student successfully - payload ${JSON.stringify(data)}`);
};

const getStudentDetail = async (id) => {
  logger.info(`Get student detail - id ${id}`);
  const account = await AccountRepository.findOne({
    _id: id,
  });
  if (!account) {
    throw new CustomException(400, "Student not found", NOT_FOUND_ERROR_CODE);
  }

  const { bucket, folder } = account.student?.verifiedResource || {};
  let publicUrls;
  if (bucket && folder) {
    const files = await awsUtils.getFileInFolder(bucket, folder);
    publicUrls = await Promise.all(
      files.map((file) => awsUtils.getPublicUrl(bucket, file?.Key))
    );
  }

  logger.info(
    `Get student detail from database successfully - ${JSON.stringify({
      ...account._doc,
      files: publicUrls,
    })}`
  );

  return { ...account._doc, files: publicUrls };
};

export const verifyStatus = async () => {
  const [verified, total] = await Promise.all([
    StudentModel.countDocuments({
      verified: true,
    }),
    StudentModel.countDocuments(),
  ]);

  return {
    verified,
    total,
  };
};

const batchUpload = async (file, createdBy) => {
  const result = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(file.path)
      .pipe(csvParser())
      .on("data", async (row) => {
        const data = {
          username: row["Mã sinh viên"],
          phone: row["Số điện thoại"],
          email: row["Email"],
          student: {
            studentId: row["Mã sinh viên"],
            name: row["Họ tên"],
            email: row["Email"],
            address: row["Địa chỉ"],
            administrativeClass: row["Lớp hành chính"],
          },
          createdBy,
        };
        try {
          await addStudent(data, createdBy);
          result.push({
            status: "success",
            data,
          });
        } catch (err) {
          logger.error(
            `Error when batch upload student ${data?.username} - ${err}`
          );
          result.push({
            status: "error",
            data,
            error: err,
          });
        }
      })
      .on("end", async () => {
        logger.info(`Batch upload student successfully - ${result.length}`);
        setTimeout(() => {
          resolve(result);
        }, 500);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

export default {
  getAllStudents,
  addStudent,
  updateStudent,
  getStudentDetail,
  verifyStatus,
  batchUpload,
};
