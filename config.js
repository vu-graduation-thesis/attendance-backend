const config = {
  port: process.env.PORT || 3000,
  mongoUrl: process.env.MONGO_URL,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  },
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.SECRET_KEY
  }
};

export default config;
