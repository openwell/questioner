import db from '../db/index';
import auth from './helpers';
import queries from './queries';
import errorHandler from '../helpers/errorHandler';

class AdminControl {
  static async login(req, res) {
    try {
      const { rows } = await db.query(queries.selectById('admins', 'email', req.body.email));
      const token = auth.generateToken(rows[0].id);
      return res.status(200).json({
        status: 200,
        data: [{
          token,
          admin: rows[0],
        }],
      });
    } catch (error) {
      return errorHandler(400, res, 'The credentials you provided is incorrect');
    }
  }
}

export default AdminControl;
