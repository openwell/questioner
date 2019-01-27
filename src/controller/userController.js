import moment from 'moment';
import db from '../db/index';
import auth from './helpers';
import queries from './queries';
import errorHandler from '../helpers/errorHandler';

class UserControl {
  static async signUp(req, res) {
    const hashPassword = auth.hashPassword(req.body.password);
    const Firstname = req.body.firstName;
    const Lastname = req.body.lastName;
    const Othername = req.body.otherName;
    const Email = req.body.email;
    const Phonenumber = req.body.phoneNumber;
    const Username = req.body.userName;
    const Registered = moment(new Date());
    const password = hashPassword;
    try {
      const { rows } = await db.query(queries.userSignUp(Firstname, Lastname,
        Othername, Email, Phonenumber, Username, Registered, 'false', password));
      const token = auth.generateToken(rows[0].id, rows[0].isadmin);
      const { firstname, lastname, othername, email, phonenumber, username, registered } = rows[0];
      return res.status(201).json({
        status: 200,
        data: [{
          token, user: { firstname, lastname, othername, email, phonenumber, username, registered },
        }],
      });
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }

  static async login(req, res) {
    try {
      const { rows } = await db.query(queries.selectById('users', 'email', req.body.email));
      const token = auth.generateToken(rows[0].id, rows[0].isadmin);
      const { firstname, lastname, email, phonenumber } = rows[0];
      return res.status(200).json({
        status: 200,
        data: [{
          token,
          user: {
            firstname, lastname, email, phonenumber,
          },
        }],
      });
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }
}

export default UserControl;
