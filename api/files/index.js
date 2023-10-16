import { Router } from "express";

import { asyncRouteHandler } from "../../middlewares/asyncRouter.js";
import { upload } from "../../middlewares/fileUpload.js";
import * as controller from "./controller.js";
import authMiddleware from "../../middlewares/auth.js";
import { STUDENT_ROLE } from "../../utils/constant.js";
import multer from "multer";

const router = Router();

router.post(
  "/batch-upload",
  authMiddleware(STUDENT_ROLE),
  upload.array("files"),
  asyncRouteHandler(controller.batchUpload)
);

router.post(
  "/recognition",
  multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads/");
      },
      filename: (req, file, cb) => {
        const { originalname } = file;
        const extension = originalname.split(".").pop();
        const filename = `${Date.now()}.${extension}`;
        console.log(filename);
        cb(null, filename);
      },
    }),
  }).single("image"),
  asyncRouteHandler(controller.recognition)
);

export default router;
