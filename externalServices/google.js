import axios from "axios";
import logger from "../utils/logger.js";

const verifyGoogleToken = async (token) => {
  try {
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );
    return response;
  } catch (error) {
    logger.error(`Error verifying Google token: ${error.message}`);
    return null;
  }
};

export default { verifyGoogleToken };
