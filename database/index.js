import mongoose from "mongoose";
import config from "../config.js";
import logger from "../utils/logger.js";
import { ADMIN_ROLE } from "../utils/constant.js";
import AccountModel from "./account.js";
import adminService from "../api/admins/service.js";

mongoose
  .connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    logger.info("Connected to MongoDB");

    // init admin
    const admin = await AccountModel.findOne({ role: ADMIN_ROLE });
    if (!admin) {
      await adminService.addAdmin({
        username: "admin",
        password: "admin",
        email: "nguyenhuuvuno1@gmail.com",
        phone: "0123456789",
        admin: {
          name: "Quản trị viên Vũ",
        },
      });
      logger.info("Init admin successfully");
    }
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB:", error);
  });

export default mongoose.connection;
