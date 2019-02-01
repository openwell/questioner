import db from '../db/index';
import queries from '../db/queries';
import errorHandler from '../middleware/errorHandler';

const currentDate = (new Date(Date.now() + 3600000)).toISOString().slice(0, -1);
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
      data: 'Welcome to Questioner',
    });
  }

  // Create an meetup record.
  static async createMeetUps(req, res) {
    const createdOn = currentDate;
    const locations = req.body.location.trim();
    const topics = req.body.topic.trim();
    const date = req.body.happeningOn.trim();
    const tag = '';
    const adminId = req.user.id;

    try {
      const { rows } = await db.query(queries.newMeetUp(createdOn, locations,
        topics, date, tag, adminId));
      return res.status(201).json({
        status: 201,
        data: rows,
      });
    } catch (err) {
      return errorHandler(500, res, err);
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
      return errorHandler(500, res, err);
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
      return errorHandler(500, res, err);
    }
  }

  // Fetch all upcoming meetup records.
  static async upComingMeetUps(req, res) {
    const sevenDaysFuture = (new Date(Date.now() + 608400000)).toISOString().slice(0, -1);
    try {
      const { rows } = await db.query(queries.upComingMeetups(currentDate, sevenDaysFuture));
      const result = rows.map(({
        id, topic, location, happeningon,
      }) => ({
        id, topic, location, happeningon,
      }));
      if (rows[0]) {
        return res.status(200).json({
          status: 200,
          data: result,
        });
      }
      return res.status(200).json({
        status: 200,
        data: 'Empty Resource',
      });
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }

  // Create a question for a specific meetup.
  static async questionEntry(req, res) {
    const createdOn = currentDate;
    const createdBys = req.user.id;
    const meetupId = req.body.meetup;
    const titles = req.body.title;
    const mainBody = req.body.body;
    try {
      const { rows } = await db.query(queries.newQuestion(createdOn, createdBys,
        meetupId, titles, mainBody, 0));
      return res.status(201).json({
        status: 201,
        data: rows,
      });
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }

  // get all questions
  static async allQuestions(req, res) {
    try {
      const { rows } = await db.query(queries.selectAll('questions'));
      const result = rows.map(({
        id, createdby, meetup_id, title, body, votes,
      }) => ({
        id, createdby, meetup_id, title, body, votes,
      }));
      return res.status(200).json({
        status: 200,
        data: result,
      });
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }

  static async questionsWithComments(req, res) {
    const quesId = req.params.questionId;
    try {
      const data1 = await db.query(queries.selectById('questions', 'id', quesId));
      const data2 = await db.query(queries.getUsersComments(quesId));
      return res.status(200).json({
        status: 200,
        data: data1.rows[0],
        comment: data2.rows,
      });
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }

  //  upVote (increase votes by 1) a specific question.
  static async upVote(req, res) {
    try {
      const { rows } = await db.query(queries.selectById('questions', 'id', req.params.questionId));
      const resp = await db.query(queries.updateVote((rows[0].votes + 1), rows[0].id));
      const { rowCount } = await db.query(queries.votes(req.params.questionId, req.user.id));
      return res.status(200).json({
        status: 200,
        data: resp.rows,
      });
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }

  // downVote (decrease votes by 1) a specific question.
  static async downVote(req, res) {
    try {
      const { rows } = await db.query(queries.selectById('questions', 'id', req.params.questionId));
      const resp = await db.query(queries.updateVote((rows[0].votes - 1), rows[0].id));
      const { rowCount } = await db.query(queries.votes(req.params.questionId, req.user.id));
      return res.status(200).json({
        status: 200,
        data: resp.rows,
      });
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }

  // Respond to meetup RSVP.
  static async rsvp(req, res) {
    const meetup = req.params.meetupId;
    const responses = req.body.response;
    const userId = req.user.id;
    const createdOn = currentDate;
    try {
      const { rows } = await db.query(queries.rsvp(meetup, responses, userId, createdOn));
      return res.status(201).json({
        status: 201,
        data: rows,
      });
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }

  static async comment(req, res) {
    const comments = req.body.comment;
    const questions = req.body.question;
    const createdOn = currentDate;
    const userId = req.user.id;
    try {
      const { rows } = await db.query(queries.comment(comments, questions, createdOn, userId));
      const response = await db.query(queries.getComment(questions, rows[0].id));
      return res.status(201).json({
        status: 201,
        data: response.rows,
      });
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }

  // get all questions
  static async allComment(req, res) {
    try {
      const { rows, rowCount } = await db.query(queries.getAllComment(req.params.questionId));
      if (rowCount === 0) {
        return errorHandler(200, res, 'Empty Resource');
      }
      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }

  static async deleteMeetUp(req, res) {
    try {
      await db.query(queries.deleteMeetup(req.params.meetupId));
      return res.status(200).json({
        status: 200,
        data: 'meetup deleted',
      });
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }
}
export default Controller;
