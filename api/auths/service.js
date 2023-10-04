import CustomException from "../../exceptions/customException.js";
import GoogleService from "../../externalServices/google.js";
import AccountRepository from "../../repositories/account.js";
import jwtUtil from "../../utils/jwt.js";
import cryptUtil from "../../utils/crypt.js";
import redisUtil from "../../utils/redis.js";
import {
  LOGIN_WITH_GOOGLE,
  LOGIN_WITH_USERNAME_PASSWORD,
  ONE_WEEK,
} from "../../utils/constant.js";

const loginWithUsernamePassword = async (username, password) => {
  const account = await AccountRepository.findOne(username);
  if (!account) {
    throw new CustomException(400, "Account not found");
  }
  if (!cryptUtil.bcryptCompare(password, account.password)) {
    throw new CustomException(403, "Wrong password");
  }

  const token = jwtUtil.generateToken(
    {
      username: account.username,
      role: account.role,
      type: LOGIN_WITH_USERNAME_PASSWORD,
    },
    {
      expiresIn: "7d",
    }
  );

  redisUtil.set(`AUTH_${account.username}`, token, {
    EX: ONE_WEEK,
  });

  return { token };
};

const loginWithGoogle = async (ggToken) => {
  const result = await GoogleService.loginWithGoogle(ggToken);
  const account = await AccountRepository.findOne(result.email);
  if (!account) {
    throw new CustomException(400, "Account not found");
  }
  const token = jwtUtil.generateToken(
    { username: account.username, role: account.role, type: LOGIN_WITH_GOOGLE },
    {
      expiresIn: "7d",
    }
  );
  return { token };
};

export default { loginWithUsernamePassword, loginWithGoogle };
