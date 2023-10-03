import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
    },
  },
  {
    timestamps: true,
  },
);

const SubjectModel = mongoose.model("subjects", subjectSchema);

export default SubjectModel;
