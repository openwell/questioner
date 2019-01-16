import moment from 'moment';
import db from '../db/index';
import auth from './helpers';
import queries from './queries';
import errorHandler from '../helpers/errorHandler';

class UserControl {
  static async signUp(req, res) {
    const hashPassword = auth.hashPassword(req.body.password);

    const firstname = req.body.firstName;
    const lastname = req.body.lastName;
    const othername = req.body.otherName;
    const Email = req.body.email;
    const phonenumber = req.body.phoneNumber;
    const username = req.body.userName;
    const registered = moment(new Date());
    const isadmin = req.body.isAdmin;
    const password = hashPassword;
    try {
      const { rows } = await db.query(queries.userSignUp(firstname, lastname,
        othername, Email, phonenumber, username, registered, isadmin, password));
      const token = auth.generateToken(rows[0].id);
      return res.status(201).json({
        status: 200,
        token,
      });
    } catch (err) {
      return errorHandler(400, res, err);
    }
  }

}

export default UserControl;