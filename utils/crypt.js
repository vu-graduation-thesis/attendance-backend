import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const bcryptCompare = (text, hash) => {
  return bcrypt.compareSync(text, hash);
};

const bcryptHash = (text) => {
  return bcrypt.hashSync(text, SALT_ROUNDS);
};

export default { bcryptHash, bcryptCompare };
