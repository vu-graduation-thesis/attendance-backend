import { Router } from "express";

import { asyncRouteHandler } from "../../middlewares/asyncRouter.js";
import { upload } from "../../middlewares/fileUpload.js";
import * as controller from "./controller.js";

const router = Router();

router.post(
  "/batch-upload",
  upload.array("files"),
  asyncRouteHandler(controller.batchUpload),
);

export default router;
