const config = {
  port: process.env.PORT || 3000,
  mongoUrl: process.env.MONGO_URL,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
  },
  jwtSecret: process.env.JWT_SECRET_KEY,
  faceRecognitionServiceUrl: process.env.FACE_RECOGNITION_SERVICE_URL,
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  domain: process.env.DOMAIN,
};

export default config;
