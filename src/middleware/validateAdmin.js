import db from '../db/index';
import auth from '../controller/helpers';
import queries from '../db/queries';
import errorHandler from './errorHandler';

class AdminValidation {
  static async checkEmailPassword(req, res, next) {
    try {
      const { rows } = await db.query(
        queries.selectById('admins', 'email', req.body.email)
      );
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

export default AdminValidation;
