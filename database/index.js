import mongoose from "mongoose";
import config from "../config.js";
import logger from "../utils/logger.js";
mongoose
  .connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB:", error);
  });

export default mongoose.connection;
