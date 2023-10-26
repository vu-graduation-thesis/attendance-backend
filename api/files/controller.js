import service from "./service.js";

const getSignedUrls = async (req, res) => {
  const { bucket, folder, files } = req.body;
  const data = await service.getSignedUrls({ bucket, folder, files });
  res.json({
    message: "Get signed urls successfully",
    data,
  });
};

export { getSignedUrls };
