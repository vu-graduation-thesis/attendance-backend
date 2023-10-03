import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: String,
    phoneNumber: String,
  },
  {
    timestamps: true,
  },
);

const AdminModel = mongoose.model("admins", adminSchema);

export default AdminModel;
