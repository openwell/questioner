<<<<<<< HEAD
import { should as _should, use, request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../index';

use(chaiHttp);
const should = _should();
const data = {
  id: '1',
  createdOn: '2018-12-2',
  location: 'London',
  topic: 'Lorem ipsum dolor sit, amet',
  happeningOn: '2018-12-2',
  tags: ['space', 'tech'],
};

const data2 = {
  id: '1',
  createdOn: '2018-12-2',
  createdBy: '33', 
  meetup: '22',
  title: 'Lorem ipsum dolor sit',
  body: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta, commodi',
  votes: '0',
};

const data3 = {
  id: '1',
  meetup: '23',
  user: '44',
  response: 'yes',
};


describe('/GET', () => {
  it('it should return index page', (done) => {
    request(server)
      .get('/api/v1')
      .end((err, res) => {
        res.should.have.a.status(200);
        res.body.should.a('object');
        done();
      });
  });
});

// Fetch all meetup records.
describe('/GET /api/v1/meetups', () => {
  it('it should return 400 error', (done) => {
    request(server)
      .get('/api/v1/meetups')
      .end((err, res) => {
        res.should.have.a.status(400);
        res.body.should.a('object');
        done();
      });
  });
});

// Create an meetup record .
describe('/POST /api/v1/meetups', () => {
  it('it should create a new meetup', (done) => {
    request(server)
      .post('/api/v1/meetups')
      .send(data)
      .end((err, res) => {
        res.should.have.a.status(201);
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
      .send(data2)
      .end((err, res) => {
        res.should.have.a.status(201);
        res.body.should.a('object');
        done();
      });
  });
});

// upVote (increase votes by 1) a specific question.
describe('/PATCH  /api/v1/questions/:questionId/upvote', () => {
  before((done) => {
    request(server)
      .post('/api/v1/questions')
      .send(data2)
      .end((err, res) => {
        res.should.have.a.status(201);
        res.body.should.a('object');
        done();
      });
  });
  it('it should update the vote count by 1', (done) => {
    request(server)
      .patch('/api/v1/questions/1/upvote')
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
      .send(data3)
      .end((err, res) => {
        res.should.have.a.status(200);
        res.body.should.a('object');
        done();
      });
  });
});
// Bad Page.
describe('/GET', () => {
  it('it should return index page', (done) => {
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
      id: '1',
      createdOn: '2018-12-2',
      topic: 'Lorem ipsum dolor sit, amet',
      location: '',
      happeningOn: '2018-12-2',
      tags: ['space', 'tech'],
    };
    request(server)
      .post('/api/v1/meetups')
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
      id: '1',
      createdOn: '2018-12-2',
      createdBy: '23',
      meetup: '',
      title: 'Lorem ipsum dolor sit',
      body: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta, commodi',
      votes: '0',
    };
    request(server)
      .post('/api/v1/questions')
      .send(data22)
      .end((err, res) => {
        res.should.have.a.status(400);
        res.body.should.a('object');
        done();
      });
  });
});

describe('/POST /api/v1/meetups/:meetupId/rsvps', () => {
  it('it should return 400 Error', (done) => {
    const data33 = {
      id: '1',
      meetup: '2',
      user: '3',
      response: '',
    };
    request(server)
      .post('/api/v1/meetups/1/rsvps')
      .send(data33)
      .end((err, res) => {
        res.should.have.a.status(400);
        res.body.should.a('object');
        done();
      });
  });
});

describe('/GET /api/v1/meetups/1/:meetupId/', () => {
  it('it should return 400 Error', (done) => {
    request(server)
      .get('/api/v1/meetups/1/5/')
      .end((err, res) => {
        res.should.have.a.status(400);
        res.body.should.a('object');
        done();
      });
  });
});

describe('/PATCH  /api/v1/questions/:questionId/upvote', () => {
  it('it should return 400 Error', (done) => {
    request(server)
      .patch('/api/v1/questions/6/upvote')
      .end((err, res) => {
        res.should.have.a.status(400);
        res.body.should.a('object');
        done();
      });
  });
});

describe('/POST /api/v1/meetups/:meetupId/rsvps', () => {
  it('it should return 400 Error', (done) => {
    request(server)
      .post('/api/v1/meetups/7/rsvps')
      .send(data3)
      .end((err, res) => {
        res.should.have.a.status(400);
        res.body.should.a('object');
        done();
      });
  });
});
=======
import { should as _should, use, request } from 'chai';
import chaiHttp from 'chai-http';
import server from '../index';

use(chaiHttp);
const should = _should();
const data = {
  id: '1',
  createdOn: '2018-12-2',
  location: 'London',
  topic: 'Lorem ipsum dolor sit, amet',
  happeningOn: '2018-12-2',
  tags: ['space', 'tech'],
};

const data2 = {
  id: '1',
  createdOn: '2018-12-2',
  createdBy: '33', 
  meetup: '22',
  title: 'Lorem ipsum dolor sit',
  body: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta, commodi',
  votes: '0',
};

const data3 = {
  id: '1',
  meetup: '23',
  user: '44',
  response: 'yes',
};


describe('/GET', () => {
  it('it should return index page', (done) => {
    request(server)
      .get('/api/v1')
      .end((err, res) => {
        res.should.have.a.status(200);
        res.body.should.a('object');
        done();
      });
  });
});

// Fetch all meetup records.
describe('/GET /api/v1/meetups', () => {
  it('it should return 400 error', (done) => {
    request(server)
      .get('/api/v1/meetups')
      .end((err, res) => {
        res.should.have.a.status(400);
        res.body.should.a('object');
        done();
      });
  });
});

// Create an meetup record .
describe('/POST /api/v1/meetups', () => {
  it('it should create a new meetup', (done) => {
    request(server)
      .post('/api/v1/meetups')
      .send(data)
      .end((err, res) => {
        res.should.have.a.status(201);
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
      .send(data2)
      .end((err, res) => {
        res.should.have.a.status(201);
        res.body.should.a('object');
        done();
      });
  });
});

// upVote (increase votes by 1) a specific question.
describe('/PATCH  /api/v1/questions/:questionId/upvote', () => {
  before((done) => {
    request(server)
      .post('/api/v1/questions')
      .send(data2)
      .end((err, res) => {
        res.should.have.a.status(201);
        res.body.should.a('object');
        done();
      });
  });
  it('it should update the vote count by 1', (done) => {
    request(server)
      .patch('/api/v1/questions/1/upvote')
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
      .send(data3)
      .end((err, res) => {
        res.should.have.a.status(200);
        res.body.should.a('object');
        done();
      });
  });
});
// Bad Page.
describe('/GET', () => {
  it('it should return index page', (done) => {
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
      id: '1',
      createdOn: '2018-12-2',
      topic: 'Lorem ipsum dolor sit, amet',
      location: '',
      happeningOn: '2018-12-2',
      tags: ['space', 'tech'],
    };
    request(server)
      .post('/api/v1/meetups')
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
      id: '1',
      createdOn: '2018-12-2',
      createdBy: '23',
      meetup: '',
      title: 'Lorem ipsum dolor sit',
      body: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta, commodi',
      votes: '0',
    };
    request(server)
      .post('/api/v1/questions')
      .send(data22)
      .end((err, res) => {
        res.should.have.a.status(400);
        res.body.should.a('object');
        done();
      });
  });
});

describe('/POST /api/v1/meetups/:meetupId/rsvps', () => {
  it('it should return 400 Error', (done) => {
    const data33 = {
      id: '1',
      meetup: '2',
      user: '3',
      response: '',
    };
    request(server)
      .post('/api/v1/meetups/1/rsvps')
      .send(data33)
      .end((err, res) => {
        res.should.have.a.status(400);
        res.body.should.a('object');
        done();
      });
  });
});

describe('/GET /api/v1/meetups/1/:meetupId/', () => {
  it('it should return 400 Error', (done) => {
    request(server)
      .get('/api/v1/meetups/1/5/')
      .end((err, res) => {
        res.should.have.a.status(400);
        res.body.should.a('object');
        done();
      });
  });
});

describe('/PATCH  /api/v1/questions/:questionId/upvote', () => {
  it('it should return 400 Error', (done) => {
    request(server)
      .patch('/api/v1/questions/6/upvote')
      .end((err, res) => {
        res.should.have.a.status(400);
        res.body.should.a('object');
        done();
      });
  });
});

describe('/POST /api/v1/meetups/:meetupId/rsvps', () => {
  it('it should return 400 Error', (done) => {
    request(server)
      .post('/api/v1/meetups/7/rsvps')
      .send(data3)
      .end((err, res) => {
        res.should.have.a.status(400);
        res.body.should.a('object');
        done();
      });
  });
});
>>>>>>> c5764d958779f8a9e784f8e39d2af5ce1ff36852
