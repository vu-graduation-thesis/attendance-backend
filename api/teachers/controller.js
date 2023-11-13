import service from "./service.js";

const getAllTeachers = async (req, res) => {
  const teachers = await service.getAllTeachers();
  res.json({
    message: "Get all teachers successfully",
    data: teachers,
  });
};

const addTeacher = async (req, res) => {
  const teacher = await service.addTeacher(req.body, req.user._id);
  res.json({
    message: "Add teacher successfully",
    data: teacher,
  });
};

const updateTeacher = async (req, res) => {
  const teacher = await service.updateTeacher(req.params.id, req.body);
  res.json({
    message: "Update teacher successfully",
    data: teacher,
  });
};

const batchUpload = async (req, res) => {
  const data = await service.batchUpload(req.file, req.user._id);
  res.json({
    message: "Batch upload successfully",
    data,
  });
};

export default { getAllTeachers, addTeacher, updateTeacher, batchUpload };
