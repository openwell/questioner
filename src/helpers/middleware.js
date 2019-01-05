import { check, validationResult } from 'express-validator/check';
import model from '../model/meetUpModel';

const middleware = {
  meetUp: [
    check('id').escape().isLength({ min: 1, max: 4 }).withMessage('must be minimum of 1-4 letter').isInt().withMessage('must be an integer'),
    check('topic').escape().isLength({ min: 10, max: 30 }).withMessage('must be minimum of 10-30 letters').isString(),
    check('location').escape().isLength({ min: 5, max: 10 }).withMessage('must be minimum of 5-10 letters').isString(),
    check('happeningOn').escape().isLength({ min: 5, max: 10 }).withMessage('must be minimum of 5-10 letters'),
    check('createdOn').escape().isLength({ min: 5, max: 10 }).withMessage('must be minimum of 5-10 letters'),
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
    check('id').escape().isLength({ min: 1, max: 4 }).withMessage('must be minimum of 1-4 letter').isInt().withMessage('must be an integer'),
    check('createdOn').escape().isLength({ min: 5, max: 10 }).withMessage('must be minimum of 5-10 letters').isString().withMessage('must be an string'),
    check('createdBy').escape().isLength({ min: 1, max: 4 }).withMessage('must be minimum of 1-4 letter').isInt().withMessage('must be an integer'),
    check('meetup').isLength({ min: 1, max: 4 }).withMessage('must be minimum of 1-4 letter').isInt().withMessage('must be an integer'),
    check('title').escape().isLength({ min: 10, max: 30 }).withMessage('must be minimum of 10-30 letters').isString().withMessage('must be an string'),
    check('body').escape().isLength({ min: 10, max: 100 }).withMessage('must be minimum of 10-100 letters').isString().withMessage('must be an string'),
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
    check('id').escape().isLength({ min: 1, max: 4 }).withMessage('must be minimum of 1-4 letter').isString().withMessage('must be an string'),
    check('meetup').escape().isLength({ min: 1, max: 4 }).withMessage('must be minimum of 1-4 letters').isInt().withMessage('must be an integer'),
    check('user').escape().isLength({ min: 1, max: 4 }).withMessage('must be minimum of 1-4 letter').isInt().withMessage('must be an integer'),
    check('response').escape().isLength({ min: 2, max: 6 }).withMessage('must be minimum of 2-6 letters').isString().withMessage('response cannot be blank'),
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
