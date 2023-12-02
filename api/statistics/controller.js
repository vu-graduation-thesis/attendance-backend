import service from "./service.js";

const statisticsClassAttendanceStatus = async (req, res) => {
  const { classId } = req.params;
  const students = await service.statisticsClassAttendanceStatus({ classId });
  res.json({
    message: "Get all students successfully",
    data: students,
  });
};

const statisticByAttendanceType = async (req, res) => {
  const data = await service.statisticByAttendanceType();
  res.json({
    message: "Get statistic by attendance type successfully",
    data,
  });
}

export default { statisticsClassAttendanceStatus, statisticByAttendanceType };
