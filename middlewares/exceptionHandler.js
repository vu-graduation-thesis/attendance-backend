export default (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      code: err.code,
      data: err.data,
    },
  });
};
