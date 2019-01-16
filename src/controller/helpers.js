import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/index';
import queries from './queries';
import errorHandler from '../helpers/errorHandler';


class auth {
  static hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  }

  static comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  }

  static generateToken(id) {
    const token = jwt.sign({
      userId: id,
    },
    process.env.SECRET, { expiresIn: '1d' });
    return token;
  }

  static async tokenHandler(table, req, res, next) {
    const token = req.headers.tokens;
    if (!token) {
      return errorHandler(400, res, 'Token is not provided');
    }
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      const { rows } = await db.query(queries.selectById(table, 'id', decoded.userId));
      if (!rows[0]) {
        return errorHandler(400, res, 'The token you provided is invalid');
      }
      req.user = { id: decoded.userId };
      next();
    } catch (error) {
      return errorHandler(400, res, error);
    }
  }

  static async verifyToken(req, res, next) {
    auth.tokenHandler('users', req, res, next);
  }

  static async adminVerifyToken(req, res, next) {
    auth.tokenHandler('admins', req, res, next);
  }
}

export default auth;
