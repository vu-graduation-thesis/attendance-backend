import mongoose from "mongoose";
import SubjectModel from "../../database/subject.js";
import logger from "../../utils/logger.js";

const getAllSubjects = async () => {
  const subjects = await SubjectModel.find({});
  logger.info(
    `Get all subjects successfully - ${
      subjects.length
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

export default { getAllSubjects, addSubject, updateSubject };
