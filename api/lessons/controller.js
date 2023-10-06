import { TEACHER_ROLE } from "../../utils/constant.js";
import service from "./service.js";

const getLessons = async (req, res) => {
  const id = req.user.role === TEACHER_ROLE ? req.user._id : undefined;
  const timeRange = {
    start: req.query.start,
    end: req.query.end,
  };
  const lessons = await service.getLessons(timeRange, id);
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

export default { getLessons, updateLesson };
