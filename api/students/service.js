import mongoose from "mongoose";
import StudentModel from "../../database/student.js";
import AccountRepository from "../../repositories/account.js";
import { EXISTED_ERROR_CODE, STUDENT_ROLE } from "../../utils/constant.js";
import logger from "../../utils/logger.js";
import AccountModel from "../../database/account.js";
import crypt from "../../utils/crypt.js";
import common from "../../utils/common.js";
import CustomException from "../../exceptions/customException.js";
import awsUtils from "../../utils/aws.js";

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
    username: payload.username,
  });
  if (existedStudent) {
    throw new CustomException(400, "Username existed", EXISTED_ERROR_CODE);
  }
  const newStudent = await StudentModel.create({
    ...(payload?.student || {}),
    createdBy: new mongoose.Types.ObjectId(createdBy),
  });

  delete payload.student;

  payload.password = common.getRandomInt(100000, 999999).toString();

  await AccountModel.create({
    ...payload,
    role: STUDENT_ROLE,
    student: newStudent._id,
    password: crypt.bcryptHash(payload.password),
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
  console.log(bucket, folder);
  const files = await awsUtils.getFileInFolder(bucket, folder);
  const publicUrls = await Promise.all(
    files.map((file) => awsUtils.getPublicUrl(bucket, file?.Key))
  );

  logger.info(
    `Get student detail from database successfully - ${JSON.stringify({
      ...account._doc,
      files: publicUrls,
    })}`
  );

  return { ...account._doc, files: publicUrls };
};

export default { getAllStudents, addStudent, updateStudent, getStudentDetail };
