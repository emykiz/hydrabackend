/** @format */
const express = require('express');
// eslint-disable-next-line no-unused-vars
const auth = require('../../middlewares/auth');
// eslint-disable-next-line no-unused-vars
const validateAcc = require('../../middlewares/validateUser');
const { waitlistController } = require('../../controllers');

const router = express.Router();

router.post('/', waitlistController.addUserToWaitlist);
router.get('/', waitlistController.getUsersFromWaitlist);
router.delete('/', waitlistController.removeAllUsersFromWaitlist);

module.exports = router;
