import service from "./service.js";

const sendMail = async (req, res) => {
  const { recipients, mailType } = req.body;
  const data = await service.sendMail({ recipients, mailType });
  res.json({
    message: "Send mail successfully",
    data,
  });
};

export { sendMail };
