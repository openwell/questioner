import pool from './setup';

pool.on('connect', () => {
  console.log('connected to the db');
});

// create Meeetup
const meetups = `CREATE TABLE IF NOT EXISTS
        meetups(
          id serial PRIMARY KEY NOT NULL,
          createdon TIMESTAMP,
          location VARCHAR(128) NOT NULL,
          topic VARCHAR(128) NOT NULL,
          happeningon VARCHAR(128) NOT NULL,
          tags VARCHAR(128) NOT NULL,
          admin_id INTEGER NOT NULL
        )`;

const users = `CREATE TABLE IF NOT EXISTS
        users(
          id serial PRIMARY KEY NOT NULL,
          firstname VARCHAR(128) NOT NULL,
          lastname VARCHAR(128) NOT NULL,
          othername VARCHAR(128) NOT NULL,
          email VARCHAR(128) UNIQUE NOT NULL,
          phonenumber NUMERIC(15) NOT NULL,
          username VARCHAR(128) NOT NULL,
          registered TIMESTAMP,
          isadmin VARCHAR(128) NOT NULL,
          password VARCHAR(128) NOT NULL
        )`;

const admins = `CREATE TABLE IF NOT EXISTS
        admins(
          id serial PRIMARY KEY NOT NULL,
          email VARCHAR(128) UNIQUE NOT NULL,
          password VARCHAR(128) NOT NULL,
          registered TIMESTAMP,
          isadmin VARCHAR(128) NOT NULL
        )`;

const questions = `CREATE TABLE IF NOT EXISTS
        questions(
          id serial PRIMARY KEY NOT NULL,
          createdon TIMESTAMP,
          createdby INTEGER NOT NULL,
          meetup_id INTEGER NOT NULL,
          title VARCHAR(128) NOT NULL,
          body VARCHAR(128) NOT NULL,
          votes INT NOT NULL
        )`;

const rsvp = `CREATE TABLE IF NOT EXISTS
        rsvp(
          id serial PRIMARY KEY NOT NULL,
          meetup_id INTEGER NOT NULL,
          response VARCHAR(128) NOT NULL,
          user_id INTEGER NOT NULL,
          created_on TIMESTAMP
        )`;

const comments = `CREATE TABLE IF NOT EXISTS
        comments(
          id serial PRIMARY KEY NOT NULL,
          comment VARCHAR(128) NOT NULL,
          question_id INTEGER NOT NULL,
          created_on TIMESTAMP,
          user_id INTEGER NOT NULL
        )`;

async function createAllTables(query1, query2, query3, query4, query5, query6) {
  try {
    const results = await Promise.all([
      pool.query(query1),
      pool.query(query2),
      pool.query(query3),
      pool.query(query4),
      pool.query(query5),
      pool.query(query6),
    ]);
    console.log(results);
    await pool.end();
  } catch (err) {
    console.log(err);
    await pool.end();
  }
}

createAllTables(meetups, users, admins, questions, rsvp, comments);

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

// adding for foreign key from the beginning didnt work well
// e.g user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
