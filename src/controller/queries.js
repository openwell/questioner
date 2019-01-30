
const Queries = {
  selectAll(table) {
    return `SELECT * FROM ${table}`;
  },
  countAll(param, table, val) {
    return `select count(${param}) from ${table} where ${param} = ${val}`;
  },
  upComingMeetups(currentDate, futureDate) {
    return {
      text: `SELECT * FROM meetups WHERE happeningon > $1
      AND happeningon <= $2 LIMIT 5`,
      values: [currentDate, futureDate],
    };
  },
  getAllCommentJoin(questionId) {
    return `SELECT c.question_id, c.comment, q.title, q.body FROM questions 
    q left join comments c on c.question_id = q.id WHERE q.id = ${questionId}`;
  },

  getCommenstUser(val) {
    return `select c.comment, c.created_on, u.username from comments c left join users u on c.user_id = u.id where c.id = ${val}`;
  },

  getComment(questionId, commentId) {
    return `SELECT c.question_id, c.comment, q.title, q.body FROM questions 
    q left join comments c on c.question_id = q.id WHERE q.id = ${questionId} and c.id =${commentId}`;
  },


  selectById(table, location, val) {
    return {
      text: `SELECT * FROM ${table} WHERE ${location} = $1`,
      values: [val],
    };
  },
  newMeetUp(...restArgs) {
    return {
      text: `INSERT INTO
      meetups(createdon, location, topic, happeningon, tags, admin_id)
      VALUES($1, $2, $3, $4, $5, $6)
      returning topic,happeningon,location,tags`,
      values: [restArgs[0], restArgs[1], restArgs[2], restArgs[3], restArgs[4], restArgs[5]],
    };
  },
  newQuestion(...restArgs) {
    return {
      text: `INSERT INTO
      questions(createdon, createdby, meetup_id, title, body, votes)
      VALUES($1, $2, $3, $4, $5, $6)
      returning createdby, meetup_id, title, body`,
      values: [restArgs[0], restArgs[1], restArgs[2], restArgs[3], restArgs[4], restArgs[5]],
    };
  },
  rsvp(meetup, response, userId, createdOn) {
    return {
      text: `INSERT INTO
      rsvp(meetup_id, response, user_id, created_on)
      VALUES($1, $2, $3, $4)
      returning meetup_id, response`,
      values: [meetup, response, userId, createdOn],
    };
  },
  comment(comment, question, createdOn, userId) {
    return {
      text: `INSERT INTO
      comments(comment, question_id, created_on, user_id)
      VALUES($1, $2, $3, $4)
      returning id, question_id, comment`,
      values: [comment, question, createdOn, userId]
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
      returning email, registered`,
      values: [email, registered, isadmin, password],
    };
  },
  userSignUp(...restArgs) {
    return {
      text: `INSERT INTO
      users(firstname, lastname, othername, email, phonenumber, 
        username, registered, isadmin, password)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
      returning id, firstname, lastname, othername, email, phonenumber, 
      username, registered`,
      values: [
        restArgs[0],
        restArgs[1],
        restArgs[2],
        restArgs[3],
        restArgs[4],
        restArgs[5],
        restArgs[6],
        restArgs[7],
        restArgs[8],
      ],
    };
  },
  updateVote(vote, id) {
    return {
      text: 'UPDATE questions SET votes = $1 WHERE id = $2 RETURNING meetup_id,title,body, votes',
      values: [vote, id],
    };
  },
  votes(questionId, userId) {
    return {
      text: `INSERT INTO
      votes(question_id, user_id)
      VALUES($1, $2)`,
      values: [questionId, userId],
    };
  },
};
export default Queries;
