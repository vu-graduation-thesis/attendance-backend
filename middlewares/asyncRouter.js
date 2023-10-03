export const asyncRouteHandler = fn => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log("handle", error);
      next(error);
    }
  };
};
