import cors from "cors";
import "dotenv/config.js";
import express from "express";

import apiRouter from "./api/index.js";
import config from "./config.js";

const app = express();

app.use(cors());

app.use("/api", apiRouter);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
