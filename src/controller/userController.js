import moment from 'moment';
import db from '../db/index';
import auth from './helpers';
import queries from '../db/queries';
import errorHandler from '../middleware/errorHandler';

const currentDate = (new Date(Date.now() + 3600000)).toISOString().slice(0, -1);

class UserControl {
  static async signUp(req, res) {
    const hashPassword = auth.hashPassword(req.body.password);
    const Firstname = req.body.firstName;
    const Lastname = req.body.lastName;
    const Othername = req.body.otherName;
    const Email = req.body.email;
    const Phonenumber = req.body.phoneNumber;
    const Username = req.body.userName;
    const Registered = currentDate;
    const password = hashPassword;
    try { const { rows } = await db.query(queries.userSignUp(Firstname, Lastname,
      Othername, Email, Phonenumber, Username, Registered, 'false', password));
    const token = auth.generateToken(rows[0].id, rows[0].isadmin);
    const { firstname, lastname, othername, email, phonenumber, username, registered, } = rows[0];
    const statistic = await db.query(queries.countAll('createdby', 'questions', rows[0].id));
    const statistic1 = await db.query(queries.countAll('user_id', 'comments', rows[0].id));
    return res.status(201).json({
      status: 200,
      data: [{token, user: { firstname, lastname, email, phonenumber, },
        totalQuestions: statistic.rows[0].count,
        totalComments: statistic1.rows[0].count, }],
    }); } catch (err) {
      return errorHandler(500, res, err);
    }
  }

  static async login(req, res) {
    try {
      const { rows } = await db.query(queries.selectById('users', 'email', req.body.email));
      const token = auth.generateToken(rows[0].id, rows[0].isadmin);
      const {
        firstname, lastname, email, phonenumber,
      } = rows[0];
      const statistic = await db.query(queries.countAll('createdby', 'questions', rows[0].id));
      const statistic1 = await db.query(queries.countAll('user_id', 'comments', rows[0].id));
      return res.status(200).json({
        status: 200,
        data: [{
          token,
          user: {
            firstname, lastname, email, phonenumber,
          },
          totalQuestions: statistic.rows[0].count,
          totalComments: statistic1.rows[0].count,
        }],
      });
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }
}

export default UserControl;
