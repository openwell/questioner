import db from '../db/index';
import auth from './helpers';
import queries from '../db/queries';
import errorHandler from '../middleware/errorHandler';

class AdminControl {
  static async login(req, res) {
    try {
      const { rows } = await db.query(queries.selectById('admins', 'email', req.body.email));
      const token = auth.generateToken(rows[0].id, rows[0].isadmin);
      const { email, registered } = rows[0];
      return res.status(200).json({
        status: 200,
        data: [{
          token,
          admin: { email, registered },
        }],
      });
    } catch (error) {
      return errorHandler(422, res, 'The credentials you provided are incorrect');
    }
  }
}

export default AdminControl;
