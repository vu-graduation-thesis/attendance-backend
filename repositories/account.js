import AccountModel from "../database/account.js";

const findOne = (username) => {
  return AccountModel.findOne({ username })
    .populate("admin")
    .populate("student")
    .populate("teacher");
};

export default { findOne };
