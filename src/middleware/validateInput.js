import { check, validationResult } from 'express-validator/check';
import errorHandler from './errorHandler';


function validatorFunction(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      errors: errors.array(),
    });
  }
  return next();
}

function paramsValidation(req, res, next) {
  let params = req.params.meetupId;
  if (req.params.questionId) {
    params = req.params.questionId;
  }
  const convertedParam = parseInt(params, 10);
  if (Number.isInteger(convertedParam)) {
    return next();
  } return errorHandler(400, res, 'params must be an integer');
}

function validationHandlerForIntegerInput(arg, min, max) {
  return check(arg)
    .escape()
    .trim()
    .isLength({ min, max })
    .withMessage(`must be minimum of ${min} -${max} letters`)
    .isInt()
    .withMessage('must be an integer');
}

function validationHandlerForStringInput(arg, min, max) {
  return check(arg)
    .escape()
    .trim()
    .isLength({ min, max })
    .withMessage(`must be minimum of ${min} -${max} letters`)
    .isString()
    .withMessage('must be a string');
}

function validationHandlerForPassword(arg) {
  return check(arg)
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i')
    .withMessage('Password must contain at least 8 characters, including 1 UPPER / 1 Lowercase a Number')
    .custom((value, { req }) => {
      if (req.body.confirmPassword === undefined) {
        return false;
      } return true;
    })
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        return false;
      }
      return value;
    })
    .withMessage("Passwords don't match.");
}

function validateHappeningOn(arg) {
  return check(arg)
    .custom((value, { req }) => {
      const inputDate = Date.parse(value);
      if (!Number(inputDate)) {
        return false;
      } return value;
    })
    .withMessage('happeningOn requires Date/time in this format (yyyy:mm:dd hh:mm:ss)')
    .custom((value, { req }) => {
      const inputDate = Date.parse(value);
      const currentDate = Date.now();
      if (currentDate > inputDate) {
        return false;
      }
      return value;
    })
    .withMessage('happeningOn requires future Date/time in this format (yyyy:mm:dd hh:mm:ss)');
}

const middleware = {
  meetUp: [
    validationHandlerForStringInput('topic', 5, 100),
    validationHandlerForStringInput('location', 4, 50),
    validateHappeningOn('happeningOn'),
    validatorFunction,
  ],
  question: [
    validationHandlerForIntegerInput('meetup', 1, 4),
    validationHandlerForStringInput('title', 10, 50),
    validationHandlerForStringInput('body', 10, 200),
    validatorFunction,
  ],
  rsvp: [
    validationHandlerForStringInput('response', 2, 6),
    validatorFunction,
  ],
  comment: [
    validationHandlerForStringInput('comment', 2, 200),
    validationHandlerForIntegerInput('question', 1, 4),
    validatorFunction,
  ],
  login: [
    check('email').trim().isEmail().escape().withMessage('Please provide a valid email'),
    check('password').trim().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, 'i')
      .withMessage('Password must contain at least 8 characters, including 1 UPPER / 1 Lowercase a Number'),
    validatorFunction,
  ],
  user: [
    validationHandlerForStringInput('firstName', 2, 20),
    validationHandlerForStringInput('lastName', 2, 20),
    validationHandlerForStringInput('otherName', 2, 20),
    check('email').trim().isEmail().escape()
      .normalizeEmail().withMessage('Please provide a valid email'),
    validationHandlerForIntegerInput('phoneNumber', 11, 12),
    validationHandlerForStringInput('userName', 4, 30),
    validationHandlerForPassword('password'),
    validatorFunction,
  ],
  Params: [paramsValidation],
};
export default middleware;
