import service from "./service.js";

const getLessons = async (req, res) => {
  const { filter } = req.query;
  const timeRange = {
    start: req.query.start,
    end: req.query.end,
  };
  const lessons = await service.getLessons(timeRange, filter);
  res.json({
    message: "Get all lessons successfully",
    data: lessons,
  });
};

const updateLesson = async (req, res) => {
  const lesson = await service.updateLesson(req.params.id, req.body);
  res.json({
    message: "Update lesson successfully",
    data: lesson,
  });
};

const manualAttendance = async (req, res) => {
  const { lessonId, studentId } = req.params;
  const lesson = await service.manualAttendance({
    lessonId,
    studentId,
  });
  res.json({
    message: "Manual attendance successfully",
    data: lesson,
  });
};

const checkLessonAttendanceValid = async (req, res) => {
  const { lessonId } = req.params;
  const isValid = await service.checkLessonAttendanceValid(lessonId);
  res.json({
    message: "Check lesson attendance valid successfully",
    data: isValid,
  });
};

export default {
  getLessons,
  updateLesson,
  manualAttendance,
  checkLessonAttendanceValid,
};
