import moment from 'moment';
import db from '../db/index';
import queries from './queries';
import errorHandler from '../helpers/errorHandler';

class Controller {
  /**
   * Create A Questioner
   * @param {object} req
   * @param {object} res
   * @returns {object} home object
   */
  static home(req, res) {
    return res.status(200).json({
      status: 200,
      data: `Welcome to Questioner ${req.reqTime}`,
    });
  }

  // Create an meetup record.
  static async createMeetUps(req, res) {
    const createdOn = moment(new Date());
    const locations = req.body.location;
    const topics = req.body.topic;
    const date = req.body.happeningOn;
    const tag = req.body.tags;
    const adminId = req.body.admin;

    try {
      const { rows } = await db.query(queries.newMeetUp(createdOn, locations,
        topics, date, tag, adminId));
      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (err) {
      return errorHandler(400, res, err);
    }
  }

  // Fetch all meetup records.
  static async allMeetUps(req, res) {
    try {
      const { rows } = await db.query(queries.selectAll('meetups'));
      const result = rows.map(({
        id, topic, location, happeningon,
      }) => ({
        id, topic, location, happeningon,
      }));
      return res.status(200).json({
        status: 200,
        data: result,
      });
    } catch (err) {
      return errorHandler(400, res, err);
    }
  }

  // Fetch a specific meetup record.
  static async findMeetUpsById(req, res) {
    try {
      const { rows } = await db.query(queries.selectById('meetups', 'id', req.params.meetupId));
      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (err) {
      return errorHandler(400, res, err);
    }
  }

  // Fetch all upcoming meetup records.
  static async upComingMeetUps(req, res) {
    try {
      const { rows } = await db.query(queries.selectAll('meetups'));
      const result = rows.map(({
        id, topic, location, happeningon,
      }) => ({
        id, topic, location, happeningon,
      }));
      return res.status(200).json({
        status: 200,
        data: result,
      });
    } catch (err) {
      return errorHandler(400, res, err);
    }
  }

  // Create a question for a specific meetup.
  static async questionEntry(req, res) {
    const createdOn = moment(new Date());
    const createdBys = req.body.createdBy;
    const meetupId = req.body.meetup;
    const titles = req.body.title;
    const mainBody = req.body.body;
    try {
      const { rows } = await db.query(queries.newQuestion(createdOn, createdBys,
        meetupId, titles, mainBody, 0));
      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (err) {
      return errorHandler(400, res, err);
    }
  }

  // get all questions
  static async allQuestions(req, res) {
    try {
      const { rows } = await db.query(queries.selectAll('questions'));
      const result = rows.map(({
        createdby, meetup_id, title, body,
      }) => ({
        createdby, meetup_id, title, body,
      }));
      return res.status(200).json({
        status: 200,
        data: result,
      });
    } catch (err) {
      return errorHandler(400, res, err);
    }
  }

  //  upVote (increase votes by 1) a specific question.
  static async upVote(req, res) {
    try {
      const { rows } = await db.query(queries.selectById('questions', 'id', req.params.questionId));
      const increase = [(rows[0].votes + 1), rows[0].id];
      const query2 = 'UPDATE questions SET votes = $1 WHERE id = $2 RETURNING meetup_id,title,body, votes';
      const resp = await db.query(query2, increase);
      return res.status(200).json({
        status: 200,
        data: resp.rows,
      });
    } catch (err) {
      return errorHandler(400, res, err);
    }
  }

  // downVote (decrease votes by 1) a specific question.
  static async downVote(req, res) {
    try {
      const { rows } = await db.query(queries.selectById('questions', 'id', req.params.questionId));
      const increase = [(rows[0].votes - 1), rows[0].id];
      const query2 = 'UPDATE questions SET votes = $1 WHERE id = $2 RETURNING meetup_id,title,body, votes';
      const resp = await db.query(query2, increase);
      return res.status(200).json({
        status: 200,
        data: resp.rows,
      });
    } catch (err) {
      return errorHandler(400, res, err);
    }
  }

  // Respond to meetup RSVP.
  static async rsvp(req, res) {
    const meetup = req.params.meetupId;
    const responses = req.body.response;
    const userId = req.body.user;
    const createdOn = moment(new Date());
    try {
      const { rows } = await db.query(queries.rsvp(meetup, responses, userId, createdOn));
      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (err) {
      return errorHandler(400, res, err);
    }
  }

  static async comment(req, res) {
    const comments = req.body.comment;
    const questions = req.body.question;
    const createdOn = moment(new Date());
    const userId = req.body.user;
    try {
      const { rows } = await db.query(queries.comment(comments, questions, createdOn, userId));
      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (err) {
      return errorHandler(400, res, err);
    }
  }

  // get all questions
  static async allComment(req, res) {
    try {
      const { rows, rowCount } = await db.query(queries.getAllCommentJoin(req.params.question_id));
      if (rowCount === 0) {
        return errorHandler(400, res, 'Empty comment table');
      }
      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (err) {
      return errorHandler(400, res, err);
    }
  }

  static async deleteMeetUp(req, res) {
    try {
      const resp = await db.query(queries.deleteMeetup(req.params.meetupId));
      if (resp.rowCount === 1) {
        return res.status(200).json({
          status: 200,
          data: 'meetup deleted',
        });
      }
    } catch (err) {
      return errorHandler(400, res, err);
    }
  }
}
export default Controller;
