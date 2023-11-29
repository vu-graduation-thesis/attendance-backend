import service from "./service.js";

const getAllStudents = async (req, res) => {
  const filter = req.query;
  console.log(filter);
  const students = await service.getAllStudents(filter);
  res.json({
    message: "Get all students successfully",
    data: students,
  });
};

const addStudent = async (req, res) => {
  const student = await service.addStudent(req.body, req.user._id);
  res.json({
    message: "Add student successfully",
    data: student,
  });
};

const updateStudent = async (req, res) => {
  const student = await service.updateStudent(req.params.id, req.body);
  res.json({
    message: "Update student successfully",
    data: student,
  });
};

const getStudentDetail = async (req, res) => {
  const student = await service.getStudentDetail(req.params.id);
  res.json({
    message: "Get student detail successfully",
    data: student,
  });
};

const verifyStatus = async (req, res) => {
  const data = await service.verifyStatus();
  res.json({
    message: "Get verify status successfully",
    data,
  });
};

const batchUpload = async (req, res) => {
  const data = await service.batchUpload(req.file, req.user._id);
  res.json({
    message: "Batch upload successfully",
    data,
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
