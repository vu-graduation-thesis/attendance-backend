import { Router } from "express";
import { asyncRouteHandler } from "../../middlewares/asyncRouter.js";
import controller from "./controller.js";
import authMiddleware from "../../middlewares/auth.js";
import { ADMIN_ROLE } from "../../utils/constant.js";

const router = Router();

router.get(
  "/",
  authMiddleware(ADMIN_ROLE),
  asyncRouteHandler(controller.getAllClassrooms)
);

router.post(
  "/",
  authMiddleware(ADMIN_ROLE),
  asyncRouteHandler(controller.addClassroom)
);

router.put(
  "/:id",
  authMiddleware(ADMIN_ROLE),
  asyncRouteHandler(controller.updateClassroom)
);

export default router;
