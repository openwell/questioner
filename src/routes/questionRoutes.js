import express from 'express';
import controller from '../controller/meetUpController';
import auth from '../controller/helpers';
import validate from '../helpers/validateInput';
import validateExist from '../helpers/validateExist';

const router = express.Router();

router.post('/questions',
  auth.verifyToken,
  validate.question,
  validateExist.checkMeetUpId,
  controller.questionEntry);

router.get('/questions',
  validateExist.checkQuestionEmpty,
  controller.allQuestions);

router.patch('/questions/:questionId/upvote',
  validate.Params,
  auth.verifyToken,
  validateExist.checkQuestionId,
  validateExist.checkVote,
  controller.upVote);

router.patch('/questions/:questionId/downvote',
  validate.Params,
  auth.verifyToken,
  validateExist.checkQuestionId,
  validateExist.checkVote,
  controller.downVote);

export default router;
