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
  res.json({
    message: "Token is valid.",
    data: req.user,
  });
};

export default { loginWithUsernamePassword, loginWithGoogle, verifyToken };
