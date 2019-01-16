import pool from './setup';

pool.on('connect', () => {
  console.log('connected to the db');
});

const queryText1 = `ALTER TABLE meetups 
  ADD CONSTRAINT meetups_admin_id_fkey FOREIGN KEY (admin_id)
  REFERENCES admins(id) ON DELETE CASCADE`;

const queryText2 = `ALTER TABLE questions 
  ADD CONSTRAINT questions_createdby_fkey FOREIGN KEY (createdby)
  REFERENCES users(id) ON DELETE CASCADE`;

const queryText3 = `ALTER TABLE questions 
  ADD CONSTRAINT questions_meetup_id_fkey FOREIGN KEY (meetup_id)
  REFERENCES meetups(id) ON DELETE CASCADE`;

const queryText4 = `ALTER TABLE rsvp 
  ADD CONSTRAINT rsvp_user_id_fkey FOREIGN KEY (user_id)
  REFERENCES users(id) ON DELETE CASCADE`;

const queryText5 = `ALTER TABLE rsvp 
  ADD CONSTRAINT rsvp_meetup_id_fkey FOREIGN KEY (meetup_id)
  REFERENCES meetups(id) ON DELETE CASCADE`;

const queryText6 = `ALTER TABLE comments 
  ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id)
  REFERENCES users(id) ON DELETE CASCADE`;

const queryText7 = `ALTER TABLE comments 
  ADD CONSTRAINT comments_question_id_fkey FOREIGN KEY (question_id)
  REFERENCES questions(id) ON DELETE CASCADE`;

async function alt(data1, data2, data3, data4, data5, data6, data7) {
  try {
    const results = await Promise.all([
      pool.query(data1),
      pool.query(data2),
      pool.query(data3),
      pool.query(data4),
      pool.query(data5),
      pool.query(data6),
      pool.query(data7),
    ]);
    console.log(results);
    await pool.end();
  } catch (err) {
    console.log(err);
    await pool.end();
  }
}

alt(queryText1, queryText2, queryText3, queryText4,
  queryText5, queryText6, queryText7);

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});
