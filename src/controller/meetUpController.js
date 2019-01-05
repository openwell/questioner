import model from '../model/meetUpModel';

class Controller {
  static home(req, res) {
    return res.status(200).json({
      status: 200,
      data: `Welcome to Questioner ${req.reqTime}`,
    });
  }

  // Create an meetup record.
  static createMeetUps(req, res) {
    const newMeetUp = req.body;
    const result = model.createMeetUp(newMeetUp);
    return res.status(201).json({
      status: 201,
      data: [result],
    });
  }

    // Fetch all meetup records.
    static allMeetUps(req, res) {
      const result = model.fetchAllMeetUps();
      return res.status(200).json({
        status: 200,
        data: result,
      });
    }

      // Fetch all upcoming meetup records.
  static upComingMeetUps(req, res) {
    const result = model.fetchAllMeetUps();
    return res.status(200).json({
      status: 200,
      data: [result],
    });
  }

  // Create a question for a specific meetup.
  static questionEntry(req, res) {
    const newQuestion = req.body;
    const result = model.createQuestion(newQuestion);
    return res.status(201).json({
      status: 201,
      data: [result],
    });
  }
}
export default Controller;
