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

function validationHandler(arg, min, max) {
  return check(arg)
    .escape()
    .isLength({ min, max })
    .withMessage(`must be minimum of ${min} -${max} letters`)
    .isInt()
    .withMessage('must be an integer');
}

function validationHandler1(arg, min, max) {
  return check(arg)
    .escape()
    .isLength({ min, max })
    .withMessage(`must be minimum of ${min} -${max} letters`)
    .isString()
    .withMessage('must be a string');
}

const middleware = {
  meetUp: [
    validationHandler('id', 1, 4),
    validationHandler1('topic', 10, 30),
    validationHandler1('location', 5, 10),
    validationHandler1('happeningOn', 5, 10),
    validationHandler1('createdOn', 5, 10),
    validatorFunction,
  ],
  question: [
    validationHandler('id', 1, 4),
    validationHandler1('createdOn', 5, 10),
    validationHandler('createdBy', 1, 4),
    validationHandler('meetup', 1, 4),
    validationHandler1('title', 10, 30),
    validationHandler1('body', 10, 100),
    validatorFunction,
  ],
  rsvp: [
    validationHandler('id', 1, 4),
    validationHandler('meetup', 1, 4),
    validationHandler('user', 1, 4),
    validationHandler1('response', 2, 6),
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
