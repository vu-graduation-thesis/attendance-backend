import logger from "../utils/logger.js";

export const asyncRouteHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      logger.error(`Api exception handler: ${error.message}`);
      next(error);
    }
  };
};
