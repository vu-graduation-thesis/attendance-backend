import AccountModel from "../database/account.js";

const findOne = (filter) => {
  return AccountModel.findOne(filter)
    .populate("admin")
    .populate("student")
    .populate("teacher");
};

const find = (filter, filter2) => {
  return AccountModel.find(filter)
    .populate("admin")
    .populate("student")
    .populate("teacher")
    .find(filter2)
    .sort({ createdAt: -1 });
};

export default { findOne, find };
