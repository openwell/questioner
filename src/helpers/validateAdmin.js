import db from '../db/index';
import auth from '../controller/helpers';
import queries from '../controller/queries';
import errorHandler from './errorHandler';

class adminValidation {
  static async checkEmailPassword(req, res, next) {
    try {
      const { rows } = await db.query(queries.selectById('admins', 'email', req.body.email));
      if (!rows[0]) {
        return errorHandler(400, res, 'The credentials you provided are incorrect');
      }
      if (!auth.comparePassword(rows[0].password, req.body.password)) {
        return errorHandler(400, res, 'The credentials you provided are incorrect');
      }
      return next();
    } catch (err) {
      return errorHandler(400, res, err);
    }
  }
}

export default adminValidation;
