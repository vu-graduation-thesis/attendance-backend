import { Router } from "express";

import { asyncRouteHandler } from "../../middlewares/asyncRouter.js";
import controller from "./controller.js";
import authMiddleware from "../../middlewares/auth.js";

const router = Router();

router.post("/login", asyncRouteHandler(controller.loginWithUsernamePassword));
router.post(
  "/login-with-google",
  asyncRouteHandler(controller.loginWithGoogle)
);
router.get("/verify-token", asyncRouteHandler(controller.verifyToken));
router.put(
  "/change-password",
  authMiddleware(),
  asyncRouteHandler(controller.changePassword)
);

router.get("/me", authMiddleware(), asyncRouteHandler(controller.getUserInfo));

export default router;
