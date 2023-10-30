import aws from "../aws/index.js";
import logger from "./logger.js";

const s3 = new aws.S3();

function getFileInFolder(bucketName, folderKey) {
  const params = {
    Bucket: bucketName,
    Prefix: folderKey,
  };

  return new Promise((resolve, reject) => {
    s3.listObjectsV2(params, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data.Contents);
      }
    });
  });
}

function getPublicUrl(bucketName, objectKey, expires = 3600) {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Expires: expires,
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl("getObject", params, (error, url) => {
      if (error) {
        reject(error);
      } else {
        resolve(url);
      }
    });
  });
}

async function uploadFilesToS3(files, bucketName, folderKey) {
  const promises = files.map((file) => {
    const params = {
      Bucket: bucketName,
      Key: `${folderKey}/${file.filename}`,
      Body: file.buffer,
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (error, data) => {
        if (error) {
          logger.error(`Upload file ${file.filename} to s3 failed ${error}`);
          reject(error);
        } else {
          logger.info(`Upload file ${file.filename} to s3 success`);
          resolve(data);
        }
      });
    });
  });

  return Promise.allSettled(promises);
}

export default { getFileInFolder, getPublicUrl, uploadFilesToS3 };
