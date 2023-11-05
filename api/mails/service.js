import logger from "../../utils/logger.js";
import mailUtil from "../../utils/mail/index.js";

const sendMail = async ({ recipients = [], mailType }) => {
  logger.info(
    `Send mail to ${JSON.stringify(recipients)} with type ${mailType}`
  );

  let subject = "";

  if (mailType === "collect_face") {
    subject = "Cung cấp dữ liệu khuôn mặt";
  }

  recipients.forEach((recipient) => {
    mailUtil.send(mailType, recipient, subject, {
      link: "http://localhost:8080/collect_face",
      email: recipient,
    });
  });
};

export default { sendMail };
