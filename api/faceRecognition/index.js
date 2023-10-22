import { Router } from "express";
import { asyncRouteHandler } from "../../middlewares/asyncRouter.js";
import * as controller from "./controller.js";
import authMiddleware from "../../middlewares/auth.js";
import { ADMIN_ROLE, TEACHER_ROLE } from "../../utils/constant.js";

const router = Router();

router.post(
  "/face-detect",
  authMiddleware(ADMIN_ROLE, TEACHER_ROLE),
  asyncRouteHandler(controller.detectAllFaces)
);

router.post(
  "/training",
  authMiddleware(ADMIN_ROLE),
  asyncRouteHandler(controller.training)
);

export default router;
