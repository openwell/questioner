import { should as _should, use, request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../index';

use(chaiHttp);
const should = _should();
const meetup = {
  id: '17',
  createdOn: '2018-12-2',
  location: 'London',
  topic: 'Lorem ipsum dolor sit, amet',
  happeningOn: '2018-12-2',
  tags: ['space', 'tech'],
  admin: '1',
};

const question = {
  id: '3',
  createdOn: '2018-12-2',
  createdBy: '1',
  meetup: '1',
  title: 'Lorem ipsum dolor sit',
  body: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta, commodi',
  votes: '0',
};

const rsvp = {
  id: '1',
  meetup: '1',
  user: '1',
  response: 'yes',
};

const user = {
  id: '007',
  firstName: 'Ronaldo',
  lastName: 'Ozil',
  otherName: 'John',
  email: 'info2@yahoo.com',
  phoneNumber: '08903332829',
  userName: 'bimpe2',
  registered: '2018-3-3',
  isAdmin: 'false',
  password: 'Timetofly2',
  confirmPassword: 'Timetofly2',
};

const comment = {
  comment: 'Hi love myself',
  question: '1',
  createdOn: '2018-12-9',
  user: '1',
};


const userLogin = {
  email: 'info2@yahoo.com',
  password: 'Timetofly2',
};

const adminLogin = {
  email: 'admin5@questioner.com',
  password: '111111',
};

let userToken;
let adminToken;

// admin login
describe('/POST', () => {
  it('admin should be able to login', (done) => {
    request(server)
      .post('/api/v1/auth/admin')
      .send(adminLogin)
      .end((err, res) => {
        res.should.have.a.status(200);
        res.body.should.a('object');
        const { token } = res.body.data[0];
        adminToken = token;
        done();
      });
  });
});

// create user
describe('/POST /api/v1/auth/signup', () => {
  it('create a user', (done) => {
    request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.a.status(201);
        res.body.should.a('object');
        done();
      });
  });
});

// user login
describe('/POST /api/v1/auth/login', () => {
  it('user should be able to login', (done) => {
    request(server)
      .post('/api/v1/auth/login')
      .send(userLogin)
      .end((err, res) => {
        res.should.have.a.status(200);
        res.body.should.a('object');
        const { token } = res.body.data[0];
        userToken = token;
        done();
      });
  });
});

// Create an meetup record.
describe('/POST /api/v1/meetups', () => {
  it('it should create a new meetup', (done) => {
    request(server)
      .post('/api/v1/meetups')
      .set('tokens', adminToken)
      .send(meetup)
      .end((err, res) => {
        res.should.have.a.status(200);
        res.body.should.a('object');
        done();
      });
  });
});

// Fetch all meetup records.
describe('/GET /api/v1/meetups', () => {
  it('it should return list of all meetups', (done) => {
    request(server)
      .get('/api/v1/meetups')
      .end((err, res) => {
        res.should.have.a.status(200);
        res.body.should.a('object');
        done();
      });
  });
});

// Fetch a specific meetup record.
describe('/GET /api/v1/meetups/1/:meetupId/', () => {
  it('it should return a single meetup', (done) => {
    request(server)
      .get('/api/v1/meetups/1/1/')
      .end((err, res) => {
        res.should.have.a.status(200);
        res.body.should.a('object');
        done();
      });
  });
});

// Fetch all upcoming meetup records.
describe('/GET /api/v1/meetups/upcoming', () => {
  it('it should return list of upcoming meetup', (done) => {
    request(server)
      .get('/api/v1/meetups/upcoming')
      .set('tokens', userToken)
      .end((err, res) => {
        res.should.have.a.status(200);
        res.body.should.a('object');
        done();
      });
  });
});

// Create a question for a specific meetup.
describe('/POST /api/v1/questions', () => {
  it('it should create a new question on a meetup', (done) => {
    request(server)
      .post('/api/v1/questions')
      .set('tokens', userToken)
      .send(question)
      .end((err, res) => {
        res.should.have.a.status(200);
        res.body.should.a('object');
        done();
      });
  });
});

// get all questions
describe('/GET /api/v1/questions', () => {
  it('it should return list of all questions', (done) => {
    request(server)
      .get('/api/v1/questions')
      .end((err, res) => {
        res.should.have.a.status(200);
        res.body.should.a('object');
        done();
      });
  });
});

// upVote (increase votes by 1) a specific question.
describe('/PATCH  /api/v1/questions/:questionId/upvote', () => {

  it('it should update the vote count by 1', (done) => {
    request(server)
      .patch('/api/v1/questions/1/upvote')
      .set('tokens', userToken)
      .end((err, res) => {
        res.should.have.a.status(200);
        res.body.should.a('object');
        done();
      });
  });
});

// downVote (decrease votes by 1) a specific question.
describe('/PATCH /api/v1/questions/:questionId/downvote', () => {
  it('it should update the vote count by 1', (done) => {
    request(server)
      .patch('/api/v1/questions/1/downvote')
      .set('tokens', userToken)
      .end((err, res) => {
        res.should.have.a.status(200);
        res.body.should.a('object');
        done();
      });
  });
});

// Respond to meetup RSVP.
describe('/POST /api/v1/meetups/:meetupId/rsvps', () => {
  it('it should update the rsvp of a meetup', (done) => {
    request(server)
      .post('/api/v1/meetups/1/rsvps')
      .set('tokens', userToken)
      .send(rsvp)
      .end((err, res) => {
        res.should.have.a.status(200);
        res.body.should.a('object');
        done();
      });
  });
});


describe('/POST /api/v1/comments', () => {
  it('user should be able to create comment', (done) => {
    request(server)
      .post('/api/v1/comments')
      .set('tokens', userToken)
      .send(comment)
      .end((err, res) => {
        res.should.have.a.status(200);
        res.body.should.a('object');
        done();
      });
  });
});


// Bad Page.
describe('/GET', () => {
  it('it should redirect', (done) => {
    request(server)
      .get('/home').redirects(0)
      .end((err, res) => {
        res.should.redirectTo('/api/v1');
        done();
      });
  });
});


// MiddleWare Test

describe('/POST /api/v1/meetups', () => {
  it('it should return 400 Error', (done) => {
    const data1 = {
      id: '001',
      topic: 'How to get Away with Murder',
      location: '',
      happeningOn: '2018-12-2',
      tags: ['space', 'tech'],
    };
    request(server)
      .post('/api/v1/meetups')
      .set('tokens', adminToken)
      .send(data1)
      .end((err, res) => {
        res.should.have.a.status(400);
        res.body.should.a('object');
        done();
      });
  });
});

describe('/POST /api/v1/questions', () => {
  it('it should return 400 Error', (done) => {
    const data22 = {
      id: '001',
      createdOn: '2018-12-2',
      createdBy: 'user', // represents the user asking the question
      meetup: '', // represents the meetup the question is for
      title: 'Lorem ipsum dolor sit',
      body: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta, commodi',
      votes: '',
    };
    request(server)
      .post('/api/v1/questions')
      .set('tokens', userToken)
      .send(data22)
      .end((err, res) => {
        res.should.have.a.status(400);
        res.body.should.a('object');
        done();
      });
  });
});

describe('/POST /api/v1/meetups/:meetupId/rsvps', () => {
  it('it should update the rsvp of a meetup', (done) => {
    const data33 = {
      id: '1',
      meetup: 'meetup-id',
      user: 'user-id',
      response: '',
    };
    request(server)
      .post('/api/v1/meetups/001/rsvps')
      .set('tokens', userToken)
      .send(data33)
      .end((err, res) => {
        res.should.have.a.status(400);
        res.body.should.a('object');
        done();
      });
  });
});
