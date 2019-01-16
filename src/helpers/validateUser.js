import db from '../db/index';
import auth from '../controller/helpers';
import queries from '../controller/queries';
import errorHandler from './errorHandler';

class userValidation {
  static async checkEmailExist(req, res, next) {
    try {
      const { rowCount } = await db.query(queries.selectById('users', 'email', req.body.email));
      if (rowCount > 0) {
        return errorHandler(400, res, 'User with that EMAIL already exist');
      }
      return next();
    } catch (err) {
      return errorHandler(400, res, err);
    }
  }


  static async checkEmailPassword(req, res, next) {
    try {
      const { rows } = await db.query(queries.selectById('users', 'email', req.body.email));
      if (!rows[0]) {
        return errorHandler(400, res, 'The credentials you provided is incorrect');
      }
      if (!auth.comparePassword(rows[0].password, req.body.password)) {
        return errorHandler(400, res, 'The credentials you provided is incorrect (password)');
      }
      return next();
    } catch (err) {
      return errorHandler(400, res, err);
    }
  }
}


export default userValidation;
