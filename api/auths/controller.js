import jwt from "../../utils/jwt.js";
import service from "./service.js";

const loginWithUsernamePassword = async (req, res) => {
  const { username, password } = req.body;
  const result = await service.loginWithUsernamePassword(username, password);

  res.json({
    message: "Login successfully.",
    data: result,
  });
};

const loginWithGoogle = async (req, res) => {
  const { username, password } = req.body;
  const result = await service.loginWithGoogle(username, password);

  res.json({
    message: "Login successfully.",
    data: result,
  });
};

const verifyToken = async (req, res) => {
  jwt.verifyToken(req.query.token);
  res.json({
    message: "Token is valid.",
    data: req.user,
  });
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const result = await service.changePassword(req.user._id, {
    oldPassword,
    newPassword,
  });

  res.json({
    message: "Change password successfully.",
    data: result,
  });
};

const getUserInfo = async (req, res) => {
  const result = await service.getUserInfo(req?.user?._id);
  res.json({
    message: "Get all admins successfully",
    data: result,
  });
};

export default {
  loginWithUsernamePassword,
  loginWithGoogle,
  verifyToken,
  changePassword,
  getUserInfo,
};
