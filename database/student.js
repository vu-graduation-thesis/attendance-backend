import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      unique: true,
      index: true,
      sparse: true,
    },
    name: String,
    email: String,
    avatar: String,
    birthday: Date,
    address: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: Date,
    verifiedResourse: {
      bucket: String,
      folder: String,
    },
  },
  {
    timestamps: true,
  }
);

const StudentModel = mongoose.model("students", studentSchema);

export default StudentModel;
