import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'autox_default_jwt_secret_dev_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? 'strict' : 'lax'
  };
};

export const sendTokenResponse = (user, statusCode, res, message = 'Authenticated successfully') => {
  const token = generateToken(user._id, user.role);
  const cookieOptions = getCookieOptions();

  res.cookie('token', token, cookieOptions);

  // Strip password hash from response
  const sanitizedUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatar: user.avatar,
    addresses: user.addresses,
    isActive: user.isActive,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt
  };

  return res.status(statusCode).json({
    success: true,
    message,
    token, // Provided also in response for clients with cookie restrictions
    data: sanitizedUser
  });
};

