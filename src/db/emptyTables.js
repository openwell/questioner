import pool from './setup';

pool.on('connect', () => {
  console.log('connected to the db');
});


async function emptyTables() {
  try {
    const res = await pool.query(`TRUNCATE TABLE comments, rsvp,
    questions, meetups, users, admins`);
    console.log(res);
    pool.end();
  } catch (err) {
    console.log(err);
    pool.end();
  }
}
emptyTables();

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});
