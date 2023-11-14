import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema(
  {
    name: String,
    location: String,
    numberOfSeats: Number,
    type: String,
    isDeleted: {
      type: Boolean,
      default: false,
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

const ClassroomModel = mongoose.model("classrooms", classroomSchema);

export default ClassroomModel;
