import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema(
  {
    name: String,
    location: String,
    numberOfSeats: Number,
    type: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
    },
  },
  {
    timestamps: true,
  }
);

const ClassroomModel = mongoose.model("classrooms", classroomSchema);

export default ClassroomModel;
