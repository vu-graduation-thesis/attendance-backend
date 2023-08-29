import { Router } from "express";
import { asyncRouteHandler } from "../../middlewares/asyncRouter.js";
import * as controller from "./controller.js";

const router = Router();

router.post(
  "/training",
  asyncRouteHandler(controller.training)
);

export default router;
