import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return successResponse(res, 200, 'Profile retrieved', user);
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PATCH /api/v1/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();
    return successResponse(res, 200, 'Profile updated successfully', user);
  } catch (err) {
    next(err);
  }
};

// @desc    Update password
// @route   PATCH /api/v1/users/password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return errorResponse(res, 400, 'Incorrect current password.');
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, 200, 'Password updated successfully.');
  } catch (err) {
    next(err);
  }
};

// @desc    Get user addresses
// @route   GET /api/v1/users/addresses
// @access  Private
export const getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return successResponse(res, 200, 'Addresses retrieved', user.addresses || []);
  } catch (err) {
    next(err);
  }
};

// @desc    Add address
// @route   POST /api/v1/users/addresses
// @access  Private
export const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const newAddress = req.body;

    // If isDefault is true or this is the first address, set all existing addresses isDefault to false
    if (newAddress.isDefault || user.addresses.length === 0) {
      user.addresses.forEach(a => { a.isDefault = false; });
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    await user.save();

    return successResponse(res, 201, 'Address added successfully', user.addresses);
  } catch (err) {
    next(err);
  }
};

// @desc    Update address
// @route   PATCH /api/v1/users/addresses/:id
// @access  Private
export const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.id);

    if (!address) {
      return errorResponse(res, 404, 'Address not found');
    }

    if (req.body.isDefault) {
      user.addresses.forEach(a => { a.isDefault = false; });
    }

    Object.assign(address, req.body);
    await user.save();

    return successResponse(res, 200, 'Address updated successfully', user.addresses);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete address
// @route   DELETE /api/v1/users/addresses/:id
// @access  Private
export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.pull({ _id: req.params.id });
    await user.save();

    return successResponse(res, 200, 'Address removed successfully', user.addresses);
  } catch (err) {
    next(err);
  }
};
