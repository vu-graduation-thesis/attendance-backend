import CustomException from "../exceptions/customException.js";
import jwtUtil from "../utils/jwt.js";
import logger from "../utils/logger.js";

const authMiddleware = (role) => (request, response, next) => {
  const authorization =
    request.header("Authorization") || request.header("authorization");
  const token = authorization?.split(" ")?.[1];
  const payload = jwtUtil.verifyToken(token);
  if (!payload) {
    return next(new CustomException(401, "Unauthorized"));
  }
  if (role && payload.role !== role) {
    logger.error(
      `User with username ${payload.username} tried to access ${request.originalUrl} but was forbidden`
    );
    return next(new CustomException(403, "Forbidden"));
  }
  logger.info(
    `User with username ${payload.username} accessed ${request.originalUrl}`
  );
  request.user = payload;
  next();
};

export default authMiddleware;
