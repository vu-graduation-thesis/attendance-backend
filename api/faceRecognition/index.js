import { Router } from "express";
import { asyncRouteHandler } from "../../middlewares/asyncRouter.js";
import * as controller from "./controller.js";
import authMiddleware from "../../middlewares/auth.js";
import {
  ADMIN_ROLE,
  STUDENT_ROLE,
  TEACHER_ROLE,
} from "../../utils/constant.js";
import { cloudUpload } from "../../middlewares/fileUpload.js";

const router = Router();

router.post(
  "/recognize/:lessonId",
  authMiddleware(STUDENT_ROLE),
  (req, res, next) => {
    req.folder = req.params.lessonId;
    req.bucket = "face-recognition-service";
    req.lessonId = req.params.lessonId;
    next();
  },
  cloudUpload("face-recognition-service").single("file"),
  asyncRouteHandler(controller.recognize)
);

router.post(
  "/training",
  authMiddleware(STUDENT_ROLE),
  (req, res, next) => {
    req.folder = req.user?.identity;
    req.bucket = "face-recognition-service";
    next();
  },
  cloudUpload("face-recognition-service").array("files", 10),
  asyncRouteHandler(controller.training)
);

export default router;
