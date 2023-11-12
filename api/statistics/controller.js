import service from "./service.js";

const statisticsClassAttendanceStatus = async (req, res) => {
  const { classId } = req.params;
  const students = await service.statisticsClassAttendanceStatus({ classId });
  res.json({
    message: "Get all students successfully",
    data: students,
  });
};

export default { statisticsClassAttendanceStatus };
