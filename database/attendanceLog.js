import mongoose from "mongoose";

const attendanceLogSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "lessons",
    },
    logs: {
      type: [
        {
          originalFile: String,
          detectedFile: String,
          bucket: String,
          predict: {
            type: [
              {
                label: String,
                confidence: Number,
                imageDetector: String,
              },
            ],
            default: [],
          },
          createdAt: {
            type: Date,
            default: new Date(),
          },
        },
      ],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
    },
  },
  {
    timestamps: true,
  }
);

const AttendanceLogModel = mongoose.model(
  "attendanceLogs",
  attendanceLogSchema
);

export default AttendanceLogModel;
