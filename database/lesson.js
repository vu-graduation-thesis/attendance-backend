import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    lessonDay: Date,
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
    resource: {
      bucket: String,
      folder: String,
    },
    order: Number,
    endAttendanceSessionTime: Date,
    location: {
      longitude: Number,
      latitude: Number,
    }
  },
  {
    timestamps: true,
  }
);

const LessonModel = mongoose.model("lessons", lessonSchema);

export default LessonModel;
