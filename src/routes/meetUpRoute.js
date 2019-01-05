import express from 'express';
import controller from '../controller/meetUpController';
import validate from '../helpers/middleware';

const router = express.Router();
const time = (req, res, next) => {
  req.reqTime = Date.now();
  next();
};

router.get('/', time, controller.home);
router.post('/meetups', validate.meetUp, controller.createMeetUps);
router.get('/meetups', validate.checkMeetUpEmpty, controller.allMeetUps);
router.get('/meetups/1/:meetupId', validate.checkMeetUpId, controller.findMeetUpsById);
router.get('/meetups/upcoming', validate.checkMeetUpEmpty, controller.upComingMeetUps);
router.post('/questions', validate.question, controller.questionEntry);

export default router;

