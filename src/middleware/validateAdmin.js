import db from '../db/index';
import auth from '../controller/helpers';
import queries from '../controller/queries';
import errorHandler from './errorHandler';

class adminValidation {
  static async checkEmailPassword(req, res, next) {
    try {
      const { rows } = await db.query(queries.selectById('admins', 'email', req.body.email));
      if (!rows[0]) {
        return errorHandler(404, res, 'Email not Found');
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

export default adminValidation;
