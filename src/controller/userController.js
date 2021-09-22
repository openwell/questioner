import db from '../db/index';
import auth from './helpers';
import queries from '../db/queries';
import errorHandler from '../middleware/errorHandler';

const currentDate = new Date(Date.now() + 3600000).toISOString().slice(0, -1);

class UserControl {
  static async signUp(req, res) {
    const {
      userName,
      phoneNumber,
      email: Email,
      otherName,
      lastName,
      firstName,
      password,
    } = req.body;
    const hashPassword = auth.hashPassword(password);
    try {
      const { rows } = await db.query(
        queries.userSignUp(
          firstName,
          lastName,
          otherName,
          Email,
          phoneNumber,
          userName,
          currentDate,
          'false',
          hashPassword
        )
      );
      const token = auth.generateToken(rows[0].id, rows[0].isadmin);
      const { firstname, lastname, email, phonenumber } = rows[0];
      return res.status(201).json({
        status: 201,
        data: [
          {
            token,
            user: {
              firstname,
              lastname,
              email,
              phonenumber,
            },
          },
        ],
      });
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }

  static async login(req, res) {
    try {
      const { rows } = await db.query(
        queries.selectById('users', 'email', req.body.email)
      );
      const token = auth.generateToken(rows[0].id, rows[0].isadmin);
      const { firstname, lastname, email, phonenumber } = rows[0];
      return res.status(200).json({
        status: 200,
        data: [
          {
            token,
            user: {
              firstname,
              lastname,
              email,
              phonenumber,
            },
          },
        ],
      });
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }
}

export default UserControl;
