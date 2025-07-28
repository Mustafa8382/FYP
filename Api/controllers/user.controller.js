import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';

// -------------------- TEST ROUTE --------------------
export const test = (req, res) => {
  res.json({
    message: 'Api route is working successfully!',
  });
};

// -------------------- UPDATE USER --------------------
export const updateUser = async (req, res, next) => {
  // Only allow the logged-in user to update their own account
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));

  try {
    // If password is being updated, hash it
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true } // Return the updated document
    );

    // Remove password before sending response
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// -------------------- DELETE USER --------------------
export const deleteUser = async (req, res, next) => {
  // Only allow the logged-in user to delete their own account
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

// -------------------- GET USER LISTINGS --------------------
export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};

// -------------------- GET USER --------------------
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, 'User not found!'));

    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// -------------------- REMOVE PROFILE IMAGE --------------------
export const removeAvatarController = async (req, res, next) => {
  // Only allow the logged-in user to remove their own avatar
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));

  try {
    // Set avatar field to empty string in MongoDB
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar: '' },
      { new: true }
    );

    if (!user) return next(errorHandler(404, 'User not found!'));

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.error('Failed to remove avatar:', error);
    res.status(500).json({ success: false, message: 'Failed to remove avatar' });
  }
};
