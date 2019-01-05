import { check, validationResult } from 'express-validator/check';
import model from '../model/meetUpModel';

const middleware = {
  meetUp: [
    check('topic')
      .isLength({ min: 10 }).withMessage('topic cannot be blank'),
    check('location').isLength({ min: 5 }).isAlpha().withMessage('location cannot be blank'),
    check('happeningOn').isLength({ min: 5 }).withMessage('happeningOn cannot be blank'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          errors: errors.array(),
        });
      }
      return next();
    },
  ],
  question: [
    check('id')
      .isLength({ min: 1 }).withMessage('id cannot be blank')
      .isNumeric().withMessage('Must be a Number'),
    check('createdOn').isLength({ min: 5 }).withMessage('createdOn cannot be blank'),
    check('createdBy').isLength({ min: 4 }).isAlpha().withMessage('createdBy cannot be blank'),
    check('meetup').isLength({ min: 5 }).withMessage('must be minimum of 5 letters'),
    check('title').isLength({ min: 10 }).withMessage('title cannot be blank'),
    check('body').isLength({ min: 10 }).withMessage('body cannot be blank'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          errors: errors.array(),
        });
      }
      return next();
    },
  ],
  rsvp: [
    check('id')
      .isLength({ min: 1 }).withMessage('id cannot be blank')
      .isNumeric().withMessage('Must be a Number'),
    check('meetup').isLength({ min: 5 }).withMessage('meetup be minimum of 9 letters'),
    check('user').isLength({ min: 5 }).withMessage('user cannot be blank'),
    check('response').isLength({ min: 2 }).isAlpha().withMessage('response cannot be blank'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 400,
          errors: errors.array(),
        });
      }
      return next();
    },
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
