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
    session: Number,
    attendances: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "students",
        },
        type: {
          type: String,
          enum: ["AI_DETECTED", "MANUAL"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const LessonModel = mongoose.model("lessons", lessonSchema);

export default LessonModel;
