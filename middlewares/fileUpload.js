import multer from "multer";
import multerS3 from "multer-s3";

import aws from "../aws/index.js";

const s3 = new aws.S3();

export const cloudUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "face-recognition-service",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, `30000/${Date.now()}-${file.originalname}`);
    },
  }),
});

export const localUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      const { originalname } = file;
      const extension = originalname.split(".").pop();
      const filename = `${Date.now()}.${extension}`;
      console.log(filename);
      cb(null, filename);
    },
  }),
});
