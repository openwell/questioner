import moment from 'moment';
import pool from './index';
import Helper from '../controller/helpers';
import queries from '../controller/queries';

async function signUp() {
  const hashPassword = Helper.hashPassword('111111');
  const email = 'admin5@questioner.com';
  const registered = moment(new Date());
  const isAdmin = 'Yes';
  const password = hashPassword;
  try {
    const { rows } = await pool.query(queries.adminSignUp(email, registered, isAdmin, password));
    const token = Helper.generateToken(rows[0].id);
    console.log([token]);
  } catch (err) {
    console.log(err);
  }
}
signUp();
