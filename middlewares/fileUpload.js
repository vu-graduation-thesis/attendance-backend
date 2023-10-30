import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { dirname } from "path";
import aws from "../aws/index.js";
import { fileURLToPath } from "url";

const s3 = new aws.S3();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname);

export const cloudUpload = (bucket) =>
  multer({
    storage: multerS3({
      s3: s3,
      bucket,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        cb(null, `${req.folder}/${Date.now()}-${file.originalname}`);
      },
    }),
  });

export const localUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});
