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
  const { idToken } = req.body;
  const result = await service.loginWithGoogle(idToken);

  res.json({
    message: "Login successfully.",
    data: result,
  });
};

const verifyToken = async (req, res) => {
  const token = req.headers?.authorization?.split(" ")?.[1];
  jwt.verifyToken(token);
  res.json({
    message: "Token is valid.",
    data: true,
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
