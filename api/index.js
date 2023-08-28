import { Router } from "express";
import fileRouter from "./files/index.js";
const router = Router();

router.use("/", fileRouter);

export default router;
