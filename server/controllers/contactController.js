import Contact from '../models/Contact.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Submit contact form message
// @route   POST /api/v1/contact
// @access  Public
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return errorResponse(res, 400, 'Please provide name, email, subject, and message.');
    }

    const contactEntry = await Contact.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      subject,
      message
    });

    return successResponse(
      res,
      201,
      'Your message has been received! The AUTOX support team will reach out shortly.',
      contactEntry
    );
  } catch (err) {
    next(err);
  }
};
