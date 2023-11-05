import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const bcryptCompare = (text, hash) => {
  return bcrypt.compareSync(text, hash);
};

const bcryptHash = (text) => {
  return bcrypt.hashSync(text, SALT_ROUNDS);
};

const generateRandomPassword = () => {
  const length = 6;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return retVal;
};

export default { bcryptHash, bcryptCompare, generateRandomPassword };
