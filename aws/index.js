import aws from "aws-sdk";
import config from "../config.js";

aws.config.update({
  accessKeyId: config.aws.accessKey,
  secretAccessKey: config.aws.secretKey
});


export default aws;