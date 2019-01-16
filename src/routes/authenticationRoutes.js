import express from 'express';
import user from '../controller/userController';
import admin from '../controller/adminController';
import auth from '../controller/helpers';
import validate from '../helpers/validateInput';
import userValidate from '../helpers/validateUser';
import adminValidate from '../helpers/validateAdmin';

const router = express.Router();

router.post('/auth/signup',
  validate.user,
  userValidate.checkEmailExist,
  user.signUp);

export default router;
