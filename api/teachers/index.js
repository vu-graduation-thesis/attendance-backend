import { Router } from "express";
import { asyncRouteHandler } from "../../middlewares/asyncRouter.js";
import controller from "./controller.js";
import authMiddleware from "../../middlewares/auth.js";
import { ADMIN_ROLE, TEACHER_ROLE } from "../../utils/constant.js";

const router = Router();

router.get(
  "/",
  authMiddleware(ADMIN_ROLE),
  asyncRouteHandler(controller.getAllTeachers)
);

router.post(
  "/",
  authMiddleware(ADMIN_ROLE),
  asyncRouteHandler(controller.addTeacher)
);

router.put(
  "/:id",
  authMiddleware(ADMIN_ROLE, TEACHER_ROLE),
  asyncRouteHandler(controller.updateTeacher)
);

export default router;
