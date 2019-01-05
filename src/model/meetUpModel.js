import moment from 'moment';

const momentDate = moment().format('MMMM Do YYYY, h:mm:ss a');

class MeetUpModel {
  constructor() {
    this.dataBase = [];
    this.questionDataBase = [];
  }

  createMeetUp(data) {
    const entry = {
      id: data.id,
      createdOn: data.createdOn,
      location: data.location,
      topic: data.topic,
      happeningOn: data.happeningOn,
      tags: data.tags,
      rsvp: [],
    };
    this.dataBase.push(entry);
    const index = this.dataBase.length - 1;
    const {
      topic, location, happeningOn, tags,
    } = this.dataBase[index];
    return {
      topic, location, happeningOn, tags,
    };
  }

  searchMeetUpById(data) {
    const {
      topic, location, happeningOn, tags,
    } = this.dataBase.find(db => db.id === data);
    return {
      topic, location, happeningOn, tags,
    };
  }

  fetchAllMeetUps() {
    const result = this.dataBase.map(({
      topic, location, happeningOn, tags,
    }) => ({
      topic, location, happeningOn, tags,
    }));
    return result;
  }

  createQuestion(data) {
    const entry = {
      id: data.id,
      createdOn: momentDate,
      createdBy: data.createdBy,
      meetup: data.meetup,
      title: data.title,
      body: data.body,
      votes: data.votes,
      voters: [],
    };
    this.questionDataBase.push(entry);
    const index = this.questionDataBase.length - 1;
    const {
      createdBy, meetup, title, body,
    } = this.questionDataBase[index];
    return {
      createdBy, meetup, title, body,
    };
  }

  vote(questionId, sign) {
    const result = this.questionDataBase.find(db => db.id === questionId);
    const index = this.questionDataBase.indexOf(result);
    if (sign === '-') this.questionDataBase[index].votes = parseInt(this.questionDataBase[index].votes, 10) - 1;
    else this.questionDataBase[index].votes = parseInt(this.questionDataBase[index].votes, 10) + 1;
    const {
      meetup, title, body, votes,
    } = result;
    return {
      meetup, title, body, votes,
    };
  }

  meetUpResponds(meetupId, data) {
    const entry = {
      id: data.id,
      meetup: data.meetup,
      user: data.user,
      response: data.response,
    };
    const result = this.dataBase.find(db => db.id === meetupId);
    const index = this.dataBase.indexOf(result);
    this.dataBase[index].rsvp.push(entry);
    const index2 = this.dataBase[index].rsvp.length - 1;
    const { meetup, user, response } = this.dataBase[index].rsvp[index2];
    return { meetup, user, response };
  }

  // checks
  checkMeetUpId(data) {
    const result = this.dataBase.find(db => db.id === data);
    return result;
  }

  checkQuestionId(data) {
    const result = this.questionDataBase.find(db => db.id === data);
    return result;
  }

  checkMeetUpEmpty() {
    return this.dataBase;
  }
}

export default new MeetUpModel();
