// /controllers/email.controller.js
import nodemailer from 'nodemailer';
import Message from '../models/Message.js'; // import your message model

export const sendEmail = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // ✅ 1. Save the message to MongoDB
    await Message.create({
      name,
      email,
      subject,
      message
    });

    // ✅ 2. Setup Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ 3. Send email
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: subject || 'New Contact Message',
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    // ✅ 4. Return success response
    res.status(200).json({ success: true, message: 'Email sent and message stored!' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ success: false, message: 'Failed to send or store message.' });
  }
};
