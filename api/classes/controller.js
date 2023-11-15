import service from "./service.js";

const getAllClasses = async (req, res) => {
  const { filter } = req.query;
  const classes = await service.getAllClasses(filter);
  res.json({
    message: "Get all classes successfully",
    data: classes,
  });
};

const getClassById = async (req, res) => {
  const _class = await service.getClassById(req.params.id);
  res.json({
    message: "Get class by id successfully",
    data: _class,
  });
};

const addClass = async (req, res) => {
  const _class = await service.addClass(req.body, req.user._id);
  res.json({
    message: "Add class successfully",
    data: _class,
  });
};

const updateClass = async (req, res) => {
  const _class = await service.updateClass(req.params.id, req.body);
  res.json({
    message: "Update class successfully",
    data: _class,
  });
};

const exportAttendance = async (req, res) => {
  const { id } = req.params;
  const data = await service.exportAttendance(id);
  res.download(data.path, data.fileName);
};

export default {
  getAllClasses,
  addClass,
  updateClass,
  getClassById,
  exportAttendance,
};
