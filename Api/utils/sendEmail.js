import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,     // 👈 Your Gmail address
        pass: process.env.EMAIL_PASS,     // 👈 App password from Gmail (not real password)
      },
    });

    const mailOptions = {
      from: `"AM Estate" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', result.response);
    return result;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw error;
  }
};

export default sendEmail;
