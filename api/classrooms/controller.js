import service from "./service.js";

const getAllClassrooms = async (req, res) => {
  const classrooms = await service.getAllClassrooms();
  res.json({
    message: "Get all classrooms successfully",
    data: classrooms,
  });
};

const addClassroom = async (req, res) => {
  const classroom = await service.addClassroom(req.body, req.user._id);
  res.json({
    message: "Add classroom successfully",
    data: classroom,
  });
};

const updateClassroom = async (req, res) => {
  const classroom = await service.updateClassroom(req.params.id, req.body);
  res.json({
    message: "Update classroom successfully",
    data: classroom,
  });
};

const batchUpload = async (req, res) => {
  const data = await service.batchUpload(req.file, req.user._id);
  res.json({
    message: "Batch upload successfully",
    data,
  });
};

export default { getAllClassrooms, addClassroom, updateClassroom, batchUpload };
