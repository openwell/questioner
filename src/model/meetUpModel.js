import moment from 'moment';

const momentDate = moment().format('MMMM Do YYYY, h:mm:ss a');

class MeetUpModel {
  constructor() {
    this.meetupDataBase = [];
    this.questionDataBase = [];
  }

  createMeetUp(meetupData) {
    const entry = {
      id: meetupData.id,
      createdOn: meetupData.createdOn,
      location: meetupData.location,
      topic: meetupData.topic,
      happeningOn: meetupData.happeningOn,
      tags: meetupData.tags,
      rsvp: [],
    };
    this.meetupDataBase.push(entry);
    const index = this.meetupDataBase.length - 1;
    const {
      topic, location, happeningOn, tags,
    } = this.meetupDataBase[index];
    return {
      topic, location, happeningOn, tags,
    };
  }

  searchMeetUpById(meetupId) {
    const {
      topic, location, happeningOn, tags,
    } = this.meetupDataBase.find(db => db.id === meetupId);
    return {
      topic, location, happeningOn, tags,
    };
  }

  fetchAllMeetUps() {
    const result = this.meetupDataBase.map(({
      topic, location, happeningOn, tags,
    }) => ({
      topic, location, happeningOn, tags,
    }));
    return result;
  }

  createQuestion(questionData) {
    const entry = {
      id: questionData.id,
      createdOn: momentDate,
      createdBy: questionData.createdBy,
      meetup: questionData.meetup,
      title: questionData.title,
      body: questionData.body,
      votes: questionData.votes,
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

  vote(questionId, voteOperator) {
    const result = this.questionDataBase.find(db => db.id === questionId);
    const index = this.questionDataBase.indexOf(result);
    if (voteOperator === '-') this.questionDataBase[index].votes = parseInt(this.questionDataBase[index].votes, 10) - 1;
    else this.questionDataBase[index].votes = parseInt(this.questionDataBase[index].votes, 10) + 1;
    const {
      meetup, title, body, votes,
    } = result;
    return {
      meetup, title, body, votes,
    };
  }

  meetUpResponds(meetupId, meetupRsvpData) {
    const entry = {
      id: meetupRsvpData.id,
      meetup: meetupRsvpData.meetup,
      user: meetupRsvpData.user,
      response: meetupRsvpData.response,
    };
    const result = this.meetupDataBase.find(db => db.id === meetupId);
    const index = this.meetupDataBase.indexOf(result);
    this.meetupDataBase[index].rsvp.push(entry);
    const index2 = this.meetupDataBase[index].rsvp.length - 1;
    const { meetup, user, response } = this.meetupDataBase[index].rsvp[index2];
    return { meetup, user, response };
  }

  // checks
  checkMeetUpId(meetupId) {
    const result = this.meetupDataBase.find(db => db.id === meetupId);
    return result;
  }

  checkQuestionId(questionId) {
    const result = this.questionDataBase.find(db => db.id === questionId);
    return result;
  }

  checkMeetUpEmpty() {
    return this.meetupDataBase;
  }
}

export default new MeetUpModel();
