import "dotenv/config.js"
import express from "express";
import cors from "cors";
import config from "./config.js";
import apiRouter from "./api/index.js";
import db from "./database/index.js";
const app = express();

if (db.readyState === 1) {
  console.log("MongoDB is connected");
} else {
  console.error("MongoDB is not connected");
}

app.use(cors());

app.use("/api", apiRouter);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
