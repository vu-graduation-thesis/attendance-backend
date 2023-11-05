import { Router } from "express";

import { asyncRouteHandler } from "../../middlewares/asyncRouter.js";
import * as controller from "./controller.js";
import authMiddleware from "../../middlewares/auth.js";
import { ADMIN_ROLE, TEACHER_ROLE } from "../../utils/constant.js";

const router = Router();

router.post(
  "/",
  authMiddleware(ADMIN_ROLE, TEACHER_ROLE),
  asyncRouteHandler(controller.sendMail)
);

export default router;
