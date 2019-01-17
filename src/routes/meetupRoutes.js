import express from 'express';
import controller from '../controller/meetUpController';
import auth from '../controller/helpers';
import validate from '../helpers/validateInput';
import validateExist from '../helpers/validateExist';

const router = express.Router();
const time = (req, res, next) => {
  req.reqTime = Date.now();
  next();
};

router.get('/', time, controller.home);

router.post('/meetups',
  auth.adminVerifyToken,
  validate.meetUp,
  validateExist.checkAdmin,
  controller.createMeetUps);

router.get('/meetups',
  validateExist.checkMeetUpEmpty,
  controller.allMeetUps);

router.get('/meetups/1/:meetupId',
  validate.meetUpParams,
  validateExist.checkMeetUpId,
  controller.findMeetUpsById);

router.get('/meetups/upcoming',
  auth.verifyToken,
  controller.upComingMeetUps);

router.post('/meetups/:meetupId/rsvps',
  validate.meetUpParams,
  validate.rsvp,
  auth.verifyToken,
  validateExist.checkMeetUpId,
  controller.rsvp);

  router.delete('/meetups/:meetupId',
  validate.meetUpParams,
  auth.adminVerifyToken,
  validateExist.checkMeetUpId,
  controller.deleteMeetUp);

export default router;
