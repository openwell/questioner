import { check, validationResult } from 'express-validator/check';
import errorHandler from './errorHandler';

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

const paramsValidation = (req, res, next) => {
  const params = req.params.meetupId;
  const convertedParam = parseInt(params, 10);
  if (Number.isInteger(convertedParam)) {
    return next();
  }
  return errorHandler(400, res, 'params is a number');
};
const paramsValidation2 = (req, res, next) => {
  const value = req.params.questionId;
  const convertedParam = parseInt(value, 10);
  if (Number.isInteger(convertedParam)) {
    return next();
  }
  return errorHandler(400, res, 'params is a number');
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

function validationHandlerForPassword(arg) {
  return check(arg)
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters in length.')
    .matches('[0-9]')
    .withMessage('Password must contain at least 1 number.')
    .matches('[a-z]')
    .withMessage('Password must contain at least 1 lowercase letter.')
    .matches('[A-Z]')
    .withMessage('Password must contain at least 1 uppercase letter.')
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        return false;
      }
      return value;
    })
    .withMessage("Passwords don't match.");
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
  comment: [
    validationHandlerForStringInput('comment', 2, 100),
    validationHandlerForIntegerInput('question', 1, 4),
    validationHandlerForStringInput('createdOn', 5, 10),
    validationHandlerForIntegerInput('user', 1, 4),
    validatorFunction,
  ],
  user: [
    validationHandlerForStringInput('firstName', 1, 20),
    validationHandlerForStringInput('lastName', 1, 20),
    validationHandlerForStringInput('otherName', 1, 20),
    check('email').isEmail().escape(),
    validationHandlerForIntegerInput('phoneNumber', 11, 12),
    validationHandlerForStringInput('userName', 1, 20),
    validationHandlerForStringInput('registered', 5, 10),
    validationHandlerForStringInput('isAdmin', 4, 6),
    validationHandlerForPassword('password'),
    validatorFunction,
  ],
  meetUpParams: [paramsValidation],
  questionParams: [paramsValidation2],

};
export default middleware;
