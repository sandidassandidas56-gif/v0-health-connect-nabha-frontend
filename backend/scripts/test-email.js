const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendTestEmail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'HealthConnect OTP Test',
      text: 'This is a test email from HealthConnect backend.'
    });
    console.log('Test email sent:', info.response);
  } catch (err) {
    console.error('Error sending test email:', err);
  }
}

sendTestEmail();
