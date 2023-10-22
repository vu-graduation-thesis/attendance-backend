import { Router } from "express";

import { asyncRouteHandler } from "../../middlewares/asyncRouter.js";
import { cloudUpload, localUpload } from "../../middlewares/fileUpload.js";
import * as controller from "./controller.js";
import authMiddleware from "../../middlewares/auth.js";
import { STUDENT_ROLE } from "../../utils/constant.js";

const router = Router();

router.post(
  "/batch-upload",
  authMiddleware(STUDENT_ROLE),
  cloudUpload.array("files"),
  asyncRouteHandler(controller.batchUpload)
);

router.post(
  "/recognition",
  localUpload.single("image"),
  asyncRouteHandler(controller.recognition)
);

export default router;
