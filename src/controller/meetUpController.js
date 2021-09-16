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
    const locations = req.body.location.trim();
    const topics = req.body.topic.trim();
    const date = req.body.happeningOn.trim();
    const tag = '';
    const { id: adminId } = req.user;

    try {
      const { rows } = await db.query(queries.newMeetUp(currentDate, locations,
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
  static async topFeeds(req, res) {
    const { id } = req.user;
    try {
      const { rows } = await db.query(queries.topFeeds(id, currentDate));
      if (rows[0]) {
        return res.status(200).json({
          status: 200,
          data: rows,
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

  static async userStatistic(req, res) {
    const { id } = req.user;
    try {
      const statistic = await db.query(queries.countAll('createdby', 'questions', id));
      const statistic1 = await db.query(queries.countAll('user_id', 'comments', id));
      return res.status(200).json({
        status: 200,
        data: [{
          totalQuestions: statistic.rows[0].count,
          totalComments: statistic1.rows[0].count,
        }],
      });
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }

  static async upComingMeetUps(req, res) {
    const sevenDaysFuture = (new Date(Date.now() + 608400000)).toISOString().slice(0, -1);
    try {
      const { rows } = await db.query(queries.upComingMeetups(currentDate, sevenDaysFuture));
      if (rows[0]) {
        return res.status(200).json({
          status: 200,
          data: rows,
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
    const { id: userId } = req.user;
    const { meetup, title, body } = req.body;
    try {
      const { rows } = await db.query(queries.newQuestion(currentDate, userId,
        meetup, title, body, 0));
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
  // Vote Up/Down

  static async Vote(req, res) {
    try {
      let resp;
      const { rows } = await db.query(queries.selectById('questions', 'id', req.params.questionId));
      if ((req.route.path === '/questions/:questionId/downvote')) {
        resp = await db.query(queries.updateVote((rows[0].votes - 1), rows[0].id));
      } else {
        resp = await db.query(queries.updateVote((rows[0].votes + 1), rows[0].id));
      }
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
    const { response } = req.body;
    const { id: userId } = req.user;
    try {
      const { rows } = await db.query(queries.rsvp(meetup, response, userId, currentDate));
      return res.status(201).json({
        status: 201,
        data: rows,
      });
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }

  // Get all RSVP
  static async getRsvp(req, res) {
    const { id: userId } = req.user;
    try {
      const { rows } = await db.query(queries.selectById('rsvp', 'user_id', userId));
      return res.status(200).json({
        status: 200,
        data: rows,
      });
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }

  static async comment(req, res) {
    const { comment, question } = req.body;
    const { id: userId } = req.user;
    try {
      const { rows } = await db.query(queries.comment(comment, question, currentDate, userId));
      const response = await db.query(queries.getComment(question, rows[0].id));
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
