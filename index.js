import cors from "cors";
import "dotenv/config.js";
import express from "express";

import apiRouter from "./api/index.js";
import config from "./config.js";
import "./database/index.js";
import exceptionHandler from "./middlewares/exceptionHandler.js";
// import "./redis/index.js";
import logger from "./utils/logger.js";

import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

fs.mkdirSync("./uploads", { recursive: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

global.__dirname = __dirname;

const app = express();

app.use(express.static("uploads"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.use(exceptionHandler);

app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});
