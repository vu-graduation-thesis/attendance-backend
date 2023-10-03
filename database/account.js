import mongoose from "mongoose";

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
    role: String,
    type: String,
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
