const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.AWS_EMAIL_HOST,
    port: process.env.AWS_EMAIL_PORT,
    auth: {
      user: process.env.AWS_EMAIL_USERNAME,
      pass: process.env.AWS_EMAIL_PASSWORD,
    },
  });
  // console.log(transporter);
  // Activate in gmail "less secure app"
  // 2) Define the email options
  const mailOptions = {
    from: 'admin NFTXRVR <2683@holbertonschool.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
