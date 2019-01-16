import pool from './setup';

pool.on('connect', () => {
  console.log('connected to the db');
});

async function dropTables() {
  try {
    const res = await pool.query(`DROP TABLE IF EXISTS comments, rsvp,
     questions, meetups, users, admins CASCADE`);
    console.log(res);
    pool.end();
  } catch (err) {
    console.log(err);
    pool.end();
  }
}
dropTables();

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});
