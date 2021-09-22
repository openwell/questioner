import express from 'express';
import controller from '../controller/meetUpController';
import auth from '../controller/helpers';
import validate from '../middleware/validateInput';
import validateExist from '../middleware/validateExist';

const router = express.Router();

router.post('/questions',
  auth.verifyToken,
  validate.question,
  validateExist.checkMeetUpId,
  controller.questionEntry);

router.get('/questions',
  validateExist.checkQuestionEmpty,
  controller.allQuestions);

router.get('/questions/topfeed',
  auth.verifyToken,
  controller.topFeeds);

router.get('/questions/:questionId',
  validate.Params,
  validateExist.checkQuestionId,
  controller.questionsWithComments);

router.patch('/questions/:questionId/upvote',
  validate.Params,
  auth.verifyToken,
  validateExist.checkQuestionId,
  validateExist.checkVote,
  controller.Vote);

router.patch('/questions/:questionId/downvote',
  validate.Params,
  auth.verifyToken,
  validateExist.checkQuestionId,
  validateExist.checkVote,
  controller.Vote);

export default router;
