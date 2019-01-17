import moment from 'moment';
import pool from './index';
import Helper from '../controller/helpers';
import queries from '../controller/queries';

async function signUp() {
  const hashPassword = Helper.hashPassword(process.env.ADMIN_PASSWORD);
  const email = process.env.ADMIN_EMAIL;
  const registered = moment(new Date());
  const isAdmin = process.env.IS_ADMIN;
  const password = hashPassword;
  try {
    const { rows } = await pool.query(queries.adminSignUp(email, registered, isAdmin, password));
    const token = Helper.generateToken(rows[0].id);
    return token;
  } catch (err) {
    console.log(err);
  }
}
signUp();
