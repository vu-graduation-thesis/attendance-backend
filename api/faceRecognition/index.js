import { Router } from "express";
import { asyncRouteHandler } from "../../middlewares/asyncRouter.js";
import * as controller from "./controller.js";
import authMiddleware from "../../middlewares/auth.js";
import { ADMIN_ROLE } from "../../utils/constant.js";

const router = Router();

router.post(
  "/training",
  authMiddleware(ADMIN_ROLE),
  asyncRouteHandler(controller.training)
);

export default router;
