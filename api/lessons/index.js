import { Router } from "express";
import { asyncRouteHandler } from "../../middlewares/asyncRouter.js";
import controller from "./controller.js";
import authMiddleware from "../../middlewares/auth.js";
import { ADMIN_ROLE, TEACHER_ROLE } from "../../utils/constant.js";

const router = Router();

router.get("/", authMiddleware(), asyncRouteHandler(controller.getLessons));

router.put(
  "/:id",
  authMiddleware(ADMIN_ROLE, TEACHER_ROLE),
  asyncRouteHandler(controller.updateLesson)
);

router.put(
  "/:lessonId/manual-attendance/:studentId",
  authMiddleware(ADMIN_ROLE, TEACHER_ROLE),
  asyncRouteHandler(controller.manualAttendance)
);

router.get(
  "/:lessonId/check-attendance-session",
  authMiddleware(),
  asyncRouteHandler(controller.checkLessonAttendanceValid)
);

export default router;
