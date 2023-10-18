import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: Number,
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
  },
  {
    timestamps: true,
  }
);

const StudentModel = mongoose.model("students", studentSchema);

export default StudentModel;
