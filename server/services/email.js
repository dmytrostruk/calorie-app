const nodemailer = require("nodemailer");
const emailConfig = require("../config/email.config");

module.exports.sendEmail = async (mailOptions) => {
  let transporter = getTransporter();

  await transporter.sendMail(mailOptions);
};

// #region Private Methods

const getTransporter = () => {
  return nodemailer.createTransport({
    service: emailConfig.SERVICE,
    auth: {
      user: emailConfig.USER,
      pass: emailConfig.PASS
    },
  });
};

// #endregion
