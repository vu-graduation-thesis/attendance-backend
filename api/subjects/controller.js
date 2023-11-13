import service from "./service.js";

const getAllSubjects = async (req, res) => {
  const subjects = await service.getAllSubjects();
  res.json({
    message: "Get all subjects successfully",
    data: subjects,
  });
};

const addSubject = async (req, res) => {
  const subject = await service.addSubject(req.body, req.user._id);
  res.json({
    message: "Add subject successfully",
    data: subject,
  });
};

const updateSubject = async (req, res) => {
  const subject = await service.updateSubject(req.params.id, req.body);
  res.json({
    message: "Update subject successfully",
    data: subject,
  });
};

const batchUpload = async (req, res) => {
  const data = await service.batchUpload(req.file, req.user._id);
  res.json({
    message: "Batch upload successfully",
    data,
  });
};

export default { getAllSubjects, addSubject, updateSubject, batchUpload };
