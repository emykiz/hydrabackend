/** @format */
const express = require('express');
// eslint-disable-next-line no-unused-vars
const auth = require('../../middlewares/auth');
// eslint-disable-next-line no-unused-vars
const validateAcc = require('../../middlewares/validateUser');
const { notificationController } = require('../../controllers');

const router = express.Router();

router.get('/', notificationController.getAllNotifiction);
router.get('/:userid', notificationController.getOneNotification);
router.delete('/:userid', notificationController.deleteOneNotification);
router.put('/:userid', notificationController.updateNotificationIfSeen);

module.exports = router;