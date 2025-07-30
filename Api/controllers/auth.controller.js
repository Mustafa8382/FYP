import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { errorHandler } from '../utils/error.js';
import sendEmail from '../utils/sendEmail.js';

// ----------------------------- SIGNUP -----------------------------
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({
      success: true,
      message: 'User created successfully!',
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or username.',
      });
    }
    console.error('Signup error:', error.message);
    next(error);
  }
};

// ----------------------------- SIGNIN -----------------------------
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' }); //update
    const { password: pass, ...userData } = validUser._doc;

    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({ success: true, user: userData }); // ✅ Return wrapped user object
  } catch (error) {
    next(error);
  }
};

// ----------------------------- GOOGLE SIGNIN -----------------------------
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;

      return res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      // Generate base username from Google name
      let baseUsername = req.body.name.split(' ').join('').toLowerCase();
      let username = baseUsername;
      let count = 1;

      // Ensure unique username
      while (await User.findOne({ username })) {
        username = `${baseUsername}${count}`;
        count++;
      }

      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username,
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;

      return res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

// ----------------------------- SIGN OUT -----------------------------
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};

// ----------------------------- FORGOT PASSWORD -----------------------------
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `https://fyp-wtsn.onrender.com/reset-password/${token}`; // ✅ Your live site For Render

    const message = `Click the following link to reset your password:\n\n${resetLink}`;

    await sendEmail(user.email, 'Password Reset Request', message);

    res.status(200).json({ success: true, message: 'Reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot Password Error:', error.message);
    next(error);
  }
};

// ------------------ RESET PASSWORD CONTROLLER ------------------
export const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required.' });
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token is invalid or expired.' });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful.' });
  } catch (error) {
    next(error);
  }
};
