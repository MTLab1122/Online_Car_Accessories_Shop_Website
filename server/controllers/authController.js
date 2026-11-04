import crypto from 'crypto';
import User from '../models/User.js';
import { sendTokenResponse } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { sendEmail } from '../utils/email.js';

// @desc    Register a new customer
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return errorResponse(res, 400, 'An account with this email address already exists.');
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: 'customer'
    });

    return sendTokenResponse(user, 201, res, 'Registration successful. Welcome to AUTOX!');
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email or password.');
    }

    if (!user.isActive) {
      return errorResponse(res, 403, 'Account is disabled. Please contact customer support.');
    }

    return sendTokenResponse(user, 200, res, 'Login successful.');
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/v1/auth/logout
// @access  Public
export const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true
  });

  return successResponse(res, 200, 'Logged out successfully.');
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res) => {
  return successResponse(res, 200, 'User profile retrieved', req.user);
};

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Do not reveal email non-existence for security
      return successResponse(res, 200, 'If that email address exists in our system, a password reset link has been dispatched.');
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const message = `You requested a password reset for your AUTOX account. Click the link below to set a new password:\n\n${resetUrl}\n\nIf you did not make this request, you can safely ignore this email. This link expires in 1 hour.`;

    await sendEmail({
      to: user.email,
      subject: 'AUTOX — Password Reset Request',
      text: message,
      html: `<div style="font-family: sans-serif; background: #080A0D; color: #FFF; padding: 24px;">
        <h2 style="color: #FF5A1F;">AUTOX Password Reset</h2>
        <p>A password reset was requested for your account.</p>
        <p><a href="${resetUrl}" style="background: #FF5A1F; color: #FFF; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a></p>
        <p style="color: #A7AFB9; font-size: 12px;">Link expires in 60 minutes.</p>
      </div>`
    });

    // In development mode return resetToken for convenience
    const devToken = process.env.NODE_ENV !== 'production' ? resetToken : undefined;

    return successResponse(res, 200, 'Password reset email sent successfully.', {
      resetToken: devToken
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return errorResponse(res, 400, 'Invalid or expired password reset token.');
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return sendTokenResponse(user, 200, res, 'Password reset successful. You are now logged in.');
  } catch (err) {
    next(err);
  }
};

