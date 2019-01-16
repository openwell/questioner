
const Queries = {
  selectAll(table) {
    return `SELECT * FROM ${table}`;
  },
  selectById(table, location, val) {
    return {
      text: `SELECT * FROM ${table} WHERE ${location} = $1`,
      values: [val],
    };
  },
  newMeetUp(createdOn, location, topic, happeningOn, tags, adminId) {
    return {
      text: `INSERT INTO
      meetups(createdon, location, topic, happeningon, tags, admin_id)
      VALUES($1, $2, $3, $4, $5, $6)
      returning *`,
      values: [createdOn, location, topic, happeningOn, tags, adminId],
    };
  },
  newQuestion(createdOn, createdBy, meetupId, title, body, votes) {
    return {
      text: `INSERT INTO
      questions(createdon, createdby, meetup_id, title, body, votes)
      VALUES($1, $2, $3, $4, $5, $6)
      returning *`,
      values: [createdOn, createdBy, meetupId, title, body, votes],
    };
  },
  rsvp(meetup, response, userId, createdOn) {
    return {
      text: `INSERT INTO
      rsvp(meetup_id, response, user_id, created_on)
      VALUES($1, $2, $3, $4)
      returning *`,
      values: [meetup, response, userId, createdOn],
    };
  },
  comment(comment, question, createdOn, userId) {
    return {
      text: `INSERT INTO
      comments(comment, question_id, created_on, user_id)
      VALUES($1, $2, $3, $4)
      returning *`,
      values: [comment, question, createdOn, userId],
    };
  },
  deleteMeetup(meetup) {
    return {
      text: 'DELETE FROM meetups WHERE id = $1',
      values: [meetup],
    };
  },
  adminSignUp(email, registered, isadmin, password) {
    return {
      text: `INSERT INTO
      admins(email, registered, isadmin, password)
      VALUES($1, $2, $3, $4)
      returning email, registered, isadmin`,
      values: [email, registered, isadmin, password],
    };
  },
  userSignUp(firstname, lastname, othername, email, phonenumber,
    username, registered, isadmin, password) {
    return {
      text: `INSERT INTO
      users(firstname, lastname, othername, email, phonenumber, 
        username, registered, isadmin, password)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
      returning firstname, lastname, othername, email, phonenumber, 
      username, registered, isadmin`,
      values: [firstname, lastname, othername, email, phonenumber,
        username, registered, isadmin, password],
    };
  },
};
export default Queries;
