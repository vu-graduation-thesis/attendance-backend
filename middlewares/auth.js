import CustomException from "../exceptions/customException.js";
import jwtUtil from "../utils/jwt.js";

const authMiddleware = (role) => (request, response, next) => {
  const authorization =
    request.header("Authorization") || request.header("authorization");
  const token = authorization?.split(" ")?.[1];
  const payload = jwtUtil.verifyToken(token);
  if (!payload) {
    return next(new CustomException(401, "Unauthorized"));
  }
  if (role && payload.role !== role) {
    return next(new CustomException(403, "Forbidden"));
  }
  request.user = payload;
  next();
};

export default authMiddleware;
