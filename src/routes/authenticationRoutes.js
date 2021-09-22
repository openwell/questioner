import express from 'express';
import user from '../controller/userController';
import admin from '../controller/adminController';
import validate from '../middleware/validateInput';
import userValidate from '../middleware/validateUser';
import adminValidate from '../middleware/validateAdmin';

const router = express.Router();

router.post('/auth/signup',
  validate.user,
  userValidate.checkEmailExist,
  user.signUp);

router.post('/auth/login',
  validate.login,
  userValidate.checkEmailPassword,
  user.login);

router.post('/auth/admin',
  validate.login,
  adminValidate.checkEmailPassword,
  admin.login);

export default router;
