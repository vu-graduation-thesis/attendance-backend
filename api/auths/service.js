import CustomException from "../../exceptions/customException.js";
import GoogleService from "../../externalServices/google.js";
import AccountRepository from "../../repositories/account.js";
import jwtUtil from "../../utils/jwt.js";
import cryptUtil from "../../utils/crypt.js";
import {
  LOGIN_WITH_GOOGLE,
  LOGIN_WITH_USERNAME_PASSWORD,
} from "../../utils/constant.js";
import logger from "../../utils/logger.js";
import AccountModel from "../../database/account.js";

const loginWithUsernamePassword = async (username, password) => {
  const account = await AccountModel.findOne({
    username,
  }).select("+password");
  if (!account) {
    logger.error(`Account with username ${username} not found`);
    throw new CustomException(400, "Account not found");
  }
  if (!cryptUtil.bcryptCompare(password, account.password)) {
    logger.error(`Wrong password for account with username ${username}`);
    throw new CustomException(403, "Wrong password");
  }

  logger.info(`Account with username ${username} logged in`);
  const token = jwtUtil.generateToken(
    {
      _id: account._id,
      username: account.username,
      role: account.role,
      type: LOGIN_WITH_USERNAME_PASSWORD,
    },
    {
      expiresIn: "7d",
    }
  );
  return { token };
};

const loginWithGoogle = async (ggToken) => {
  const result = await GoogleService.loginWithGoogle(ggToken);
  const account =
    result &&
    (await AccountRepository.findOne({
      email: result?.email,
    }));
  if (!account) {
    logger.error(
      `Account login with Google by email ${result?.email || ggToken} not found`
    );
    throw new CustomException(400, "Account not found");
  }
  logger.info(
    `Account with Google by email ${result?.email} ${account.username} logged in`
  );
  const token = jwtUtil.generateToken(
    {
      _id: account._id,
      username: account.username,
      role: account.role,
      type: LOGIN_WITH_GOOGLE,
    },
    {
      expiresIn: "7d",
    }
  );
  return { token };
};

const changePassword = async (id, { oldPassword, newPassword }) => {
  const account = await AccountModel.findById(id);
  if (!account) {
    logger.error(`Account with id ${id} not found`);
    throw new CustomException(400, "Account not found");
  }
  if (!cryptUtil.bcryptCompare(oldPassword, account.password)) {
    logger.error(`Wrong old password for account with id ${id}`);
    throw new CustomException(403, "Wrong old password");
  }
  account.password = cryptUtil.bcryptHash(newPassword);
  await account.save();
  logger.info(`Account with id ${id} changed password`);
  return { message: "Change password successfully" };
};

export default { loginWithUsernamePassword, loginWithGoogle, changePassword };
