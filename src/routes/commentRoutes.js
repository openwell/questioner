import express from 'express';
import controller from '../controller/meetUpController';
import auth from '../controller/helpers';
import validate from '../helpers/validateInput';
import validateExit from '../helpers/validateExist';

const router = express.Router();

router.get('/comments/:question_id',
  controller.allComment);

router.post('/comments',
  validate.comment,
  auth.verifyToken,
  validateExit.checkQuestionId2,
  validateExit.checkUser,
  controller.comment);

export default router;
