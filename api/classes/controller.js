import service from "./service.js";

const getAllClasses = async (req, res) => {
  const classes = await service.getAllClasses();
  res.json({
    message: "Get all classes successfully",
    data: classes,
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

export default { getAllClasses, addClass, updateClass };
