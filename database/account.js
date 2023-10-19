import mongoose from "mongoose";
import { ADMIN_ROLE, STUDENT_ROLE, TEACHER_ROLE } from "../utils/constant.js";

const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      select: false,
    },
    email: {
      type: String,
      index: true,
    },
    phone: {
      type: String,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: [ADMIN_ROLE, STUDENT_ROLE, TEACHER_ROLE],
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
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
