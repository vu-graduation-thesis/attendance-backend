const batchUpload = async (req, res) => {
  if (req.files.length === 0) {
    return res.status(400).json({
      message: "No files were uploaded.",
    });
  }

  const images = req.files.map((file) => file.location);

  res.json({
    message: "Uploaded successfully.",
    data: {
      images,
    },
  });
};

export { batchUpload };
