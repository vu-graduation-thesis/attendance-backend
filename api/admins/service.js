import mongoose from "mongoose";
import AdminModel from "../../database/admin.js";
import AccountRepository from "../../repositories/account.js";
import {
  ADMIN_ROLE,
  EXISTED_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
} from "../../utils/constant.js";
import logger from "../../utils/logger.js";
import AccountModel from "../../database/account.js";
import crypt from "../../utils/crypt.js";
import CustomException from "../../exceptions/customException.js";
import mailUtils from "../../utils/mail/index.js";
import config from "../../config.js";

const getAllAdmins = async () => {
  let admins = await AccountRepository.find({
    role: ADMIN_ROLE,
    isDeleted: { $ne: true },
  });
  logger.info(
    `Get all admins successfully - ${admins.length} admins - ${JSON.stringify(
      admins
    )}`
  );
  return admins;
};

const addAdmin = async (admin) => {
  const existedAdmin = await AccountModel.findOne({
    username: admin.username,
  });
  if (existedAdmin) {
    throw new CustomException(400, "Username existed", EXISTED_ERROR_CODE);
  }
  const newAdmin = await AdminModel.create({
    ...(admin.admin || {}),
  });

  admin.password = admin.password || crypt.generateRandomPassword();

  const newAccount = await AccountModel.create({
    ...admin,
    role: ADMIN_ROLE,
    admin: newAdmin._id,
    password: crypt.bcryptHash(admin.password),
  });

  const subject = "Thông tin tài khoản admin mới";
  mailUtils.send("new_admin_account", admin.email, subject, {
    link: config.domain,
    username: admin.username,
    password: admin.password,
  });

  logger.info(`Add admin successfully - ${JSON.stringify(newAdmin)}`);
  return newAccount;
};

const updateAdmin = async (id, data = {}) => {
  const account = await AccountRepository.findOne({ _id: id });
  if (!account) {
    throw new CustomException(400, "Admin not found", NOT_FOUND_ERROR_CODE);
  }

  const admin = data?.admin || {};
  data.admin = undefined;

  await Promise.all([
    AdminModel.updateOne(
      { _id: account?.admin?._id },
      {
        $set: admin,
      }
    ),
    AccountModel.updateOne(
      { _id: id },
      {
        $set: {
          ...(data || {}),
        },
      }
    ),
  ]);

  logger.info(`Update admin successfully - payload ${JSON.stringify(data)}`);
};
export default { getAllAdmins, addAdmin, updateAdmin };
