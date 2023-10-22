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
  "/face-detect",
  authMiddleware(ADMIN_ROLE, TEACHER_ROLE),
  asyncRouteHandler(controller.detectAllFaces)
);

router.post(
  "/training",
  authMiddleware(STUDENT_ROLE),
  cloudUpload((req, file, cb) => ({
    bucket: "face-recognition-service",
    folder: req.user?.student?.studentId,
  })),
  asyncRouteHandler(controller.training)
);

export default router;
