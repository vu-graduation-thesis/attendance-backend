import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: String,
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

const SubjectModel = mongoose.model("subjects", subjectSchema);

export default SubjectModel;
