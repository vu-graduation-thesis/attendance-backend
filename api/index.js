import { Router } from "express";
import fileRouter from "./files/index.js";
import faceRecognitionRouter from "./faceRecognition/index.js"
const router = Router();

router.use("/files", fileRouter);
router.use("/face-recognition", faceRecognitionRouter)

export default router;
