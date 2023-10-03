import axios from "axios";

const verifyGoogleToken = async token => {
  const response = await axios.get(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`,
  );
  return response;
};

export default { verifyGoogleToken };
