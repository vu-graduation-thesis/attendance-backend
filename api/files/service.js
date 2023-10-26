import awsUtils from "../../utils/aws.js";
import logger from "../../utils/logger.js";

const getSignedUrls = async ({ bucket, folder, files }) => {
  logger.info(
    `Get signed urls for bucket ${bucket}, folder ${folder}, files ${JSON.stringify(
      files
    )}`
  );
  if (!bucket || (!folder && !files)) {
    logger.error(`Invalid request, please provide bucket and folder or files`);
    throw new CustomException(
      "Invalid request",
      "Please provide bucket and folder or files"
    );
  }

  if (folder) {
    files = await awsUtils.getFileInFolder(bucket, folder);
    logger.info(
      `Get files in folder ${folder} successfully, files ${JSON.stringify(
        files
      )}`
    );
  }

  const signedUrls = await Promise.allSettled(
    files.map((file) => awsUtils.getPublicUrl(bucket, file, 60 * 60 * 24))
  );
  logger.info(
    `Get signed urls for bucket ${bucket}, folder ${folder}, files ${JSON.stringify(
      files
    )} successfully`
  );

  const result = signedUrls.reduce((acc, cur, index) => {
    acc[files?.[index]] = cur.value;
    return acc;
  }, {});

  return result;
};

export default { getSignedUrls };
