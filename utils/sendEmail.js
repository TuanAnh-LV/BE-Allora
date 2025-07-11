const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Hoặc smtp khác nếu cần
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    },
    tls: {
      rejectUnauthorized: false // Bỏ qua lỗi tự ký chứng chỉ (không khuyến khích trong production)
    }
  });

  await transporter.sendMail({
    from: `"SalesApp" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html
  });
};

module.exports = sendEmail;
