import AccountModel from "../database/account.js";

const findOne = (username) => {
  return AccountModel.findOne({ username })
    .populate("admin")
    .populate("student")
    .populate("teacher");
};

const find = (filter) => {
  return AccountModel.find(filter)
    .populate("admin")
    .populate("student")
    .populate("teacher");
};

export default { findOne, find };
