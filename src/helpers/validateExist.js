import db from '../db/index';
import queries from '../controller/queries';
import auth from '../controller/helpers';
import errorHandler from './errorHandler';

class validateExist {
  static async validate(table, value, message, res, next) {
    try {
      const { rows } = await db.query(queries.selectById(table, 'id', value));
      if (rows[0]) {
        return next();
      }
      return errorHandler(400, res, message);
    } catch (err) {
      return errorHandler(400, res, message);
    }
  }


  static async checkMeetUpId(req, res, next) { 
    const value = req.params.meetupId;
    validateExist.validate('meetups', value, 'The credentials you provided are incorrect', res, next);
  }


  static async checkMeetUpId2(req, res, next) { 
    const value = req.body.meetup;
    validateExist.validate('meetups', value, 'The credentials you provided are incorrect', res, next);
  }


  static async checkUser(req, res, next) {
    const value = req.body.user;
    validateExist.validate('users', value, 'The credentials you provided are incorrect', res, next);
  }


  static async checkAdmin(req, res, next) {
    const value = req.body.admin;
    validateExist.validate('admins', value, 'The credentials you provided are incorrect', res, next);
  }

  static async checkQuestionId(req, res, next) {
    const params = req.params.questionId;
    validateExist.validate('questions', params,
      'The credentials you provided are incorrect', res, next);
  }

  static async checkQuestionId2(req, res, next) {
    const params = req.body.question;
    validateExist.validate('questions', params,
      'The credentials you provided are incorrect', res, next);
  }

  static async checkMeetUpEmpty(req, res, next) {
    try {
      const { rows } = await db.query(queries.selectAll('meetups'));
      if (rows[0]) {
        return next();
      }
      return errorHandler(400, res, 'Empty DataBase');
    } catch (err) {
      return errorHandler(400, res, err);
    }
  }

  static async checkQuestionEmpty(req, res, next) {
    try {
      const { rows } = await db.query(queries.selectAll('questions'));
      if (rows[0]) {
        return next();
      }
      return errorHandler(400, res, 'Empty DataBase');
    } catch (err) {
      return errorHandler(400, res, err);
    }
  }
}

export default validateExist;
