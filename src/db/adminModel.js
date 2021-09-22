import pool from './index';
import Helper from '../controller/helpers';
import queries from './queries';

const currentDate = (new Date(Date.now() + 3600000)).toISOString().slice(0, -1);

async function signUp() {
  const hashPassword = Helper.hashPassword(process.env.ADMIN_PASSWORD);
  const email = process.env.ADMIN_EMAIL;
  const registered = currentDate;
  const isAdmin = process.env.IS_ADMIN;
  const password = hashPassword;
  try {
    const { rows } = await pool.query(queries.adminSignUp(email, registered, isAdmin, password));
    return console.log(`Admin Sign up Successfully ${rows[0].email}`);
  } catch (err) {
    return console.log(err);
  }
}
export default signUp();
