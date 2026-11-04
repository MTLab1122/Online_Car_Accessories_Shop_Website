import { errorResponse } from '../utils/apiResponse.js';

export const validate = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (validated.body) req.body = validated.body;
    if (validated.query) req.query = validated.query;
    if (validated.params) req.params = validated.params;

    next();
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map(e => ({
        field: e.path.join('.').replace(/^body\./, ''),
        message: e.message
      }));
      return errorResponse(res, 400, 'Validation failed. Please verify submitted details.', formattedErrors);
    }
    return errorResponse(res, 400, err.message || 'Invalid request payload');
  }
};
