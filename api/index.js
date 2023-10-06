import { Router } from "express";

import authRouter from "./auths/index.js";
import faceRecognitionRouter from "./faceRecognition/index.js";
import fileRouter from "./files/index.js";
import teacherRouter from "./teachers/index.js";
import classroomRouter from "./classrooms/index.js";
import subjectRouter from "./subjects/index.js";
import studentRouter from "./students/index.js";
import adminRouter from "./admins/index.js";
import classRouter from "./classes/index.js";
import lessonRouter from "./lessons/index.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/files", fileRouter);
router.use("/face-recognition", faceRecognitionRouter);
router.use("/teachers", teacherRouter);
router.use("/classrooms", classroomRouter);
router.use("/subjects", subjectRouter);
router.use("/students", studentRouter);
router.use("/admins", adminRouter);
router.use("/classes", classRouter);
router.use("/lessons", lessonRouter);

export default router;
