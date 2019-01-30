import express from 'express';
import controller from '../controller/meetUpController';
import auth from '../controller/helpers';
import validate from '../middleware/validateInput';
import validateExit from '../middleware/validateExist';

const router = express.Router();

router.get('/comments/:question_id',
  controller.allComment);

router.post('/comments',
  validate.comment,
  auth.verifyToken,
  validateExit.checkQuestionId,
  controller.comment);

export default router;
