import mongoose from "mongoose";
import SubjectModel from "../../database/subject.js";
import CustomException from "../../exceptions/customException.js";
import logger from "../../utils/logger.js";
import fs from "fs";
import csvParser from "csv-parser";

const getAllSubjects = async () => {
  const subjects = await SubjectModel.find({
    isDeleted: { $ne: true },
  }).sort({
    createdAt: -1,
  });;
  logger.info(
    `Get all subjects successfully - ${subjects.length
    } subjects - ${JSON.stringify(subjects)}`
  );
  return subjects;
};

const addSubject = async (subject, createdBy) => {
  const newSubject = await SubjectModel.create({
    ...subject,
    createdBy: new mongoose.Types.ObjectId(createdBy),
  });
  logger.info(`Add subject successfully - ${JSON.stringify(newSubject)}`);
  return newSubject;
};

const updateSubject = async (id, subject) => {
  const updatedSubject = await SubjectModel.findByIdAndUpdate(id, subject, {
    new: true,
  });
  logger.info(
    `Update subject successfully - ${JSON.stringify(updatedSubject)}`
  );
  return updatedSubject;
};

const batchUpload = async (file, createdBy) => {
  const result = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(file.path)
      .pipe(csvParser())
      .on("data", async (row) => {
        const data = {
          name: row["Tên môn học"],
          type: row["Loại môn học"],
          createdBy,
        };
        result.push(data);
      })
      .on("end", async () => {
        try {
          await SubjectModel.insertMany(result);
          logger.info(`Batch upload student successfully - ${result.length}`);
          resolve(result);
        } catch (err) {
          logger.error(`Error when batch upload student - ${err}`);
          throw new CustomException(400, "Error when batch upload student");
        }
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

export default { getAllSubjects, addSubject, updateSubject, batchUpload };
