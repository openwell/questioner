import db from '../db/index';
import auth from '../controller/helpers';
import queries from '../db/queries';
import errorHandler from './errorHandler';

class userValidation {
  static async checkEmailExist(req, res, next) {
    try {
      const { rowCount } = await db.query(queries.selectById('users', 'email', req.body.email));
      if (rowCount > 0) {
        return next(409);
      }
      return next();
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }


  static async checkEmailPassword(req, res, next) {
    try {
      const { rows } = await db.query(queries.selectById('users', 'email', req.body.email));
      if (!rows[0]) {
        return errorHandler(401, res, 'Invalid Email');
      }
      if (!auth.comparePassword(rows[0].password, req.body.password)) {
        return errorHandler(401, res, 'Invalid Password');
      }
      return next();
    } catch (err) {
      return errorHandler(500, res, err);
    }
  }
}


export default userValidation;
