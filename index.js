import express from "express";
const app = express();
import cors from "cors";
import aws from "aws-sdk";
import config from "./config.js";
import apiRouter from "./api/index.js";
import db from "./database/index.js";
import messageQueue from "./queue/index.js";

if (db.readyState === 1) {
  console.log("MongoDB is connected");
} else {
  console.error("MongoDB is not connected");
}

app.use(cors());

app.use("/api", apiRouter);

aws.config.update({
  accessKeyId: "YOUR_AWS_ACCESS_KEY",
  secretAccessKey: "YOUR_AWS_SECRET_ACCESS_KEY",
  region: "YOUR_AWS_REGION",
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
