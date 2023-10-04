import service from "./service.js";

const getAllStudents = async (req, res) => {
  const students = await service.getAllStudents();
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

export default { getAllStudents, addStudent, updateStudent };
