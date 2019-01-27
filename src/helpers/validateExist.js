import db from '../db/index';
import queries from '../controller/queries';
import errorHandler from './errorHandler';

class validateExist {
  static async validate(table, value, message, res, next) {
    try {
      const { rows } = await db.query(queries.selectById(table, 'id', value));
      if (rows[0]) {
        return next();
      }
      return errorHandler(404, res, message);
    } catch (err) {
      return errorHandler(500, res, message);
    }
  }


  static async checkMeetUpId(req, res, next) {
    let value = req.params.meetupId;
    if (req.body.meetup) {
      value = (req.body.meetup);
    }
    validateExist.validate('meetups', value, 'Meetup-id not found', res, next);
  }

  static async checkQuestionId(req, res, next) {
    let params = req.params.questionId;
    if (req.body.question) {
      params = req.body.question;
    }
    validateExist.validate('questions', params,
      'Question-id not found', res, next);
  }

  static async checkMeetUpEmpty(req, res, next) {
    try {
      const { rows } = await db.query(queries.selectAll('meetups'));
      if (rows[0]) {
        return next();
      }
      return errorHandler(404, res, 'MeetUp not found');
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }

  static async checkQuestionEmpty(req, res, next) {
    try {
      const { rows } = await db.query(queries.selectAll('questions'));
      if (rows[0]) {
        return next();
      }
      return errorHandler(404, res, 'question not found');
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }


  static async checkRSVP(req, res, next) {
    const meetup = req.params.meetupId;
    const responses = req.body.response;
    const userId = req.user.id;
    const text = 'SELECT * FROM rsvp WHERE meetup_id = $1 AND user_id =$2';
    const value = [meetup, userId];
    try {
      const { rowCount } = await db.query(text, value);
      if (rowCount > 0) {
        const text1 = 'UPDATE rsvp set response = $1 WHERE meetup_id = $2 returning meetup_id, response';
        const value1 = [responses, meetup];
        const { rows } = await db.query(text1, value1);
        return res.status(200).json({
          status: 200,
          data: rows,
        });
      }
    } catch (err) {
      return errorHandler(500, res, err);
    }
    return next();
  }

  static async checkVote(req, res, next) {
    const text = 'SELECT * FROM votes WHERE user_id = $1 AND question_id =$2';
    const value = [req.user.id, req.params.questionId];
    try {
      const { rowCount } = await db.query(text, value);
      if (rowCount > 0) {
        return res.status(400).json({
          status: 400,
          data: 'User has a Registered Vote',
        });
      }
    } catch (err) {
      return errorHandler(500, res, err);
    }
    return next();
  }
}


export default validateExist;
