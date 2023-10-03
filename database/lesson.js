import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    lessonDay: Date,
    lessonTime: String,
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classrooms",
    },
    students: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "students",
        },
        attendanceType: {
          type: String,
          enum: ["AI-DETECTED", "MANUAL"],
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("lessons", lessonSchema);

export default User;
