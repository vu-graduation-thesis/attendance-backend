import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import config from "../../config.js";
import path from "path";

// Đọc nội dung của template email từ tệp

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: config.mail.user,
    pass: config.mail.pass,
  },
});

const send = async (mailType, to, subject, data) => {
  const templateName = `utils/mail/templates/${mailType}.hbs`;
  const emailTemplateSource = fs.readFileSync(
    path.join(__dirname, templateName),
    "utf8"
  );
  const emailTemplate = handlebars.compile(emailTemplateSource);

  const mailOptions = {
    from: config.mail.user,
    to,
    subject,
    html: emailTemplate(data),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Send mail error: ", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export default { send };
