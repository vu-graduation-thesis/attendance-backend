import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  avatar: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
