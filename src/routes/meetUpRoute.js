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
router.get('/meetups/upcoming', validate.checkMeetUpEmpty, controller.upComingMeetUps);

export default router;

