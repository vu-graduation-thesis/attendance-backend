import { Router } from "express";
import { asyncRouteHandler } from "../../middlewares/asyncRouter.js";
import controller from "./controller.js";
import authMiddleware from "../../middlewares/auth.js";
import { ADMIN_ROLE, TEACHER_ROLE } from "../../utils/constant.js";

const router = Router();

/*
 * @route GET /api/statistics/classes/:classId
 * @desc Statistics on student attendance status for all class sessions
 */
router.get(
  "/classes/:classId",
  authMiddleware(ADMIN_ROLE, TEACHER_ROLE),
  asyncRouteHandler(controller.statisticsClassAttendanceStatus)
);

export default router;
