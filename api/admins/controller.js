import service from "./service.js";

const getAllAdmins = async (req, res) => {
  const admins = await service.getAllAdmins();
  res.json({
    message: "Get all admins successfully",
    data: admins,
  });
};

const addAdmin = async (req, res) => {
  const admin = await service.addAdmin(req.body, req.user._id);
  res.json({
    message: "Add admin successfully",
    data: admin,
  });
};

const updateAdmin = async (req, res) => {
  const admin = await service.updateAdmin(req.params.id, req.body);
  res.json({
    message: "Update admin successfully",
    data: admin,
  });
};

export default { getAllAdmins, addAdmin, updateAdmin };
