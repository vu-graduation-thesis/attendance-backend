import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    classId: String,
    name: String,
    startTime: Date,
    endTime: Date,
    numberOfCredits: Number,
    totalNumberOfLessons: Number,
    isActivate: Boolean,
    lessonSchedules: [
      {
        startDay: String,
        classroom: String,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subjects",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accounts",
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ClassModel = mongoose.model("classes", classSchema);

export default ClassModel;
