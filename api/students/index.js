import { Router } from "express";
import { asyncRouteHandler } from "../../middlewares/asyncRouter.js";
import controller from "./controller.js";
import authMiddleware from "../../middlewares/auth.js";
import { ADMIN_ROLE } from "../../utils/constant.js";

const router = Router();

router.get(
  "/",
  authMiddleware(ADMIN_ROLE),
  asyncRouteHandler(controller.getAllStudents)
);

router.post(
  "/",
  authMiddleware(ADMIN_ROLE),
  asyncRouteHandler(controller.addStudent)
);

router.put(
  "/:id",
  authMiddleware(ADMIN_ROLE),
  asyncRouteHandler(controller.updateStudent)
);

router.get(
  "/:id",
  authMiddleware(),
  asyncRouteHandler(controller.getStudentDetail)
);

export default router;
