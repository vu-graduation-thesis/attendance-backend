import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: String,
    phoneNumber: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
    },
  },
  {
    timestamps: true,
  }
);

const TeacherModel = mongoose.model("teachers", teacherSchema);

export default TeacherModel;
