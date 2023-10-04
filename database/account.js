import mongoose from "mongoose";
import { ADMIN_ROLE, STUDENT_ROLE, TEACHER_ROLE } from "../utils/constant.js";

const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      index: true,
    },
    password: String,
    email: {
      type: String,
      index: true,
    },
    role: {
      type: String,
      enum: [ADMIN_ROLE, STUDENT_ROLE, TEACHER_ROLE],
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
    },
  },
  {
    timestamps: true,
  }
);

const AccountModel = mongoose.model("accounts", accountSchema);

export default AccountModel;
