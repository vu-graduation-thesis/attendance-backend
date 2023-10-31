import service from "./service.js";

const getAttendanceLogs = async (req, res) => {
  const attendances = await service.findAttendanceLogs({
    lessonId: req.query.lessonId,
  });
  res.json({
    message: "Get all attendances successfully",
    data: attendances,
  });
};

export default { getAttendanceLogs };
