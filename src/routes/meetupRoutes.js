import express from 'express';
import controller from '../controller/meetUpController';
import auth from '../controller/helpers';
import validate from '../middleware/validateInput';
import validateExist from '../middleware/validateExist';

const router = express.Router();

router.get('/', controller.home);

router.post('/meetups',
  auth.adminVerifyToken,
  validate.meetUp,
  controller.createMeetUps);

router.get('/meetups',
  validateExist.checkMeetUpEmpty,
  controller.allMeetUps);

router.get('/meetups/upcoming',
  auth.verifyToken,
  controller.upComingMeetUps);

router.get('/meetups/rsvps',
  auth.verifyToken,
  controller.getRsvp);

router.get('/meetups/:meetupId',
  validate.Params,
  validateExist.checkMeetUpId,
  controller.findMeetUpsById);

router.get('/meetups/user/statistic',
  auth.verifyToken,
  controller.userStatistic);

router.post('/meetups/:meetupId/rsvps',
  validate.Params,
  validate.rsvp,
  auth.verifyToken,
  validateExist.checkMeetUpId,
  validateExist.checkRSVP,
  controller.rsvp);

router.delete('/meetups/:meetupId',
  validate.Params,
  auth.adminVerifyToken,
  validateExist.checkMeetUpId,
  controller.deleteMeetUp);

export default router;
