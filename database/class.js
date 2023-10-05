import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: String,
    startTime: Date,
    endTime: Date,
    numberOfCredit: Number,
    isActivate: Boolean,
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
