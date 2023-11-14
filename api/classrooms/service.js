import mongoose from "mongoose";
import ClassroomModel from "../../database/classroom.js";
import logger from "../../utils/logger.js";
import fs from "fs";
import csvParser from "csv-parser";

const getAllClassrooms = async () => {
  const classrooms = await ClassroomModel.find({
    isDeleted: { $ne: true },
  });
  logger.info(
    `Get all classrooms successfully - ${
      classrooms.length
    } classrooms - ${JSON.stringify(classrooms)}`
  );
  return classrooms;
};

const addClassroom = async (classroom, createdBy) => {
  const newClassroom = await ClassroomModel.create({
    ...classroom,
    createdBy: new mongoose.Types.ObjectId(createdBy),
  });
  logger.info(`Add classroom successfully - ${JSON.stringify(newClassroom)}`);
  return newClassroom;
};

const updateClassroom = async (id, classroom) => {
  const updatedClassroom = await ClassroomModel.findByIdAndUpdate(
    id,
    classroom,
    {
      new: true,
    }
  );
  logger.info(
    `Update classroom successfully - ${JSON.stringify(updatedClassroom)}`
  );
  return updatedClassroom;
};

const batchUpload = async (file, createdBy) => {
  const result = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(file.path)
      .pipe(csvParser())
      .on("data", async (row) => {
        const data = {
          name: row["Tên phòng học"],
          location: row["Vị trí phòng học"],
          numberOfSeats: row["Số chỗ ngồi"],
          type: row["Loại phòng học"],
          createdBy,
        };
        result.push(data);
      })
      .on("end", async () => {
        try {
          await ClassroomModel.insertMany(result);
          logger.info(`Batch upload classroom successfully - ${result.length}`);
          resolve(result);
        } catch (err) {
          logger.error(`Error when batch upload classroom - ${err}`);
          throw new CustomException(400, "Error when batch upload classroom");
        }
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

export default { getAllClassrooms, addClassroom, updateClassroom, batchUpload };
