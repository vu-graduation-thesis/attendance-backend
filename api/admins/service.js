import mongoose from "mongoose";
import AdminModel from "../../database/admin.js";
import AccountRepository from "../../repositories/account.js";
import { ADMIN_ROLE, EXISTED_ERROR_CODE } from "../../utils/constant.js";
import logger from "../../utils/logger.js";
import AccountModel from "../../database/account.js";
import crypt from "../../utils/crypt.js";
import CustomException from "../../exceptions/customException.js";

const getAllAdmins = async () => {
  let admins = await AccountRepository.find({ role: ADMIN_ROLE });
  logger.info(
    `Get all admins successfully - ${admins.length} admins - ${JSON.stringify(
      admins
    )}`
  );
  return admins;
};

const addAdmin = async (admin, createdBy) => {
  const existedAdmin = await AccountModel.findOne({
    username: admin.username,
  });
  if (existedAdmin) {
    throw new CustomException(400, "Username existed", EXISTED_ERROR_CODE);
  }

  const newAdmin = await AdminModel.create({
    ...admin,
    createdBy: new mongoose.Types.ObjectId(createdBy),
  });

  const newAccount = await AccountModel.create({
    ...admin,
    role: ADMIN_ROLE,
    admin: newAdmin._id,
    password: crypt.bcryptHash(admin.password),
  });
  logger.info(`Add admin successfully - ${JSON.stringify(newAdmin)}`);
  return newAccount;
};

const updateAdmin = async (id, admin) => {
  const updatedAdmin = await AdminModel.findByIdAndUpdate(id, admin, {
    new: true,
  });
  logger.info(`Update admin successfully - ${JSON.stringify(updatedAdmin)}`);
  return updatedAdmin;
};

export default { getAllAdmins, addAdmin, updateAdmin };
