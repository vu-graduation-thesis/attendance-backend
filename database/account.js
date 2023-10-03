import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    email: String,
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
  },
);

const AcountModel = mongoose.model("accounts", accountSchema);

export default AcountModel;
