import jwt from "jsonwebtoken";

import config from "../config.js";

const generateToken = (payload, options) => {
  return jwt.sign(payload, config.jwtSecret, options);
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
};

export default { generateToken, verifyToken };
