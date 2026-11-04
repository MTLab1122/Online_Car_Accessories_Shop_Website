import express from 'express';
import {
  getProfile,
  updateProfile,
  updatePassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  updateProfileSchema,
  updatePasswordSchema,
  addressSchema
} from '../validators/authValidator.js';

const router = express.Router();

router.use(protect); // All user routes require authentication

router.route('/profile')
  .get(getProfile)
  .patch(validate(updateProfileSchema), updateProfile)
  .put(validate(updateProfileSchema), updateProfile);

router.patch('/password', validate(updatePasswordSchema), updatePassword);

router.route('/addresses')
  .get(getAddresses)
  .post(validate(addressSchema), addAddress);

router.route('/addresses/:id')
  .patch(updateAddress)
  .delete(deleteAddress);

export default router;

