import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: Number,
      unique: true,
      index: true,
    },
    name: String,
    email: String,
    avatar: String,
    birthday: Date,
    address: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
    },
  },
  {
    timestamps: true,
  }
);

const StudentModel = mongoose.model("students", studentSchema);

export default StudentModel;
