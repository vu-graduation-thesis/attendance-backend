import jwt from "jsonwebtoken";

import config from "../config.js";
import CustomException from "../exceptions/customException.js";
import { TOKEN_IS_INVALID } from "./constant.js";

const generateToken = (payload, options) => {
  return jwt.sign(payload, config.jwtSecret, options);
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new CustomException(400, "Token is invalid.", TOKEN_IS_INVALID);
  }
};

export default { generateToken, verifyToken };
