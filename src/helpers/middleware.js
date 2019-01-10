import { check, validationResult } from 'express-validator/check';
import model from '../model/meetUpModel';

const validatorFunction = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      errors: errors.array(),
    });
  }
  return next();
};

function validationHandlerForIntegerInput(arg, min, max) {
  return check(arg)
    .escape()
    .isLength({ min, max })
    .withMessage(`must be minimum of ${min} -${max} letters`)
    .isInt()
    .withMessage('must be an integer');
}

function validationHandlerForStringInput(arg, min, max) {
  return check(arg)
    .escape()
    .isLength({ min, max })
    .withMessage(`must be minimum of ${min} -${max} letters`)
    .isString()
    .withMessage('must be a string');
}

const middleware = {
  meetUp: [
    validationHandlerForIntegerInput('id', 1, 4),
    validationHandlerForStringInput('topic', 10, 30),
    validationHandlerForStringInput('location', 5, 10),
    validationHandlerForStringInput('happeningOn', 5, 10),
    validationHandlerForStringInput('createdOn', 5, 10),
    validatorFunction,
  ],
  question: [
    validationHandlerForIntegerInput('id', 1, 4),
    validationHandlerForStringInput('createdOn', 5, 10),
    validationHandlerForIntegerInput('createdBy', 1, 4),
    validationHandlerForIntegerInput('meetup', 1, 4),
    validationHandlerForStringInput('title', 10, 30),
    validationHandlerForStringInput('body', 10, 100),
    validatorFunction,
  ],
  rsvp: [
    validationHandlerForIntegerInput('id', 1, 4),
    validationHandlerForIntegerInput('meetup', 1, 4),
    validationHandlerForIntegerInput('user', 1, 4),
    validationHandlerForStringInput('response', 2, 6),
    validatorFunction,
  ],
  checkMeetUpId: [
    (req, res, next) => {
      const meetUpId = req.params.meetupId;
      const result = model.checkMeetUpId(meetUpId);
      if (result === undefined) {
        return res.status(400).json({
          status: 400,
          errors: 'MeetUp does not exist',
        });
      }
      return next();
    },
  ],
  checkQuestionId: [
    (req, res, next) => {
      const meetUpId = req.params.questionId;
      const result = model.checkQuestionId(meetUpId);
      if (result === undefined) {
        return res.status(400).json({
          status: 400,
          errors: 'Question does not exist',
        });
      }
      return next();
    },
  ],
  checkMeetUpEmpty: [
    (req, res, next) => {
      const result = model.checkMeetUpEmpty();
      if (result.length < 1) {
        return res.status(400).json({
          status: 400,
          errors: ['Data Base Empty'],
        });
      }
      return next();
    },
  ],
};

export default middleware;
