import mongoose from "mongoose";
import ClassroomModel from "../../database/classroom.js";
import logger from "../../utils/logger.js";

const getAllClassrooms = async () => {
  const classrooms = await ClassroomModel.find({});
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

export default { getAllClassrooms, addClassroom, updateClassroom };
