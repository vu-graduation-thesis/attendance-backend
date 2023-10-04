import { Router } from "express";

import { asyncRouteHandler } from "../../middlewares/asyncRouter.js";
import { upload } from "../../middlewares/fileUpload.js";
import * as controller from "./controller.js";
import authMiddleware from "../../middlewares/auth.js";
import { STUDENT_ROLE } from "../../utils/constant.js";

const router = Router();

router.post(
  "/batch-upload",
  authMiddleware(STUDENT_ROLE),
  upload.array("files"),
  asyncRouteHandler(controller.batchUpload)
);

export default router;
