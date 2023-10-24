import aws from "../aws/index.js";

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

export default { getFileInFolder, getPublicUrl };
