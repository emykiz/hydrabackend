/* eslint-disable no-unused-vars */
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const validateAcc = require('../../middlewares/validateUser');
const { groupController } = require('../../controllers');
const { singleUpload, multipleUpload } = require('../../libs/multer');
const { groupValidation } = require('../../validations');

const router = express.Router();

router.get('/recent', validateAcc, groupController.getGoupsRecentMsgs);
router.post('/new', validateAcc, singleUpload, validate(groupValidation.createGroup), groupController.createGroup);
router.get('/single/1/:name', validateAcc, groupController.getGroupByName);
router.get('/single/:id', validateAcc, groupController.getGroupById);
router.patch('/update/logo/:groupId', singleUpload, validateAcc, groupController.uploadLogo);
router.delete('/:groupId', validateAcc, groupController.deleteGroup);
router.post('/msg', validateAcc, multipleUpload, validate(groupValidation.sendMessage), groupController.sendMessage);
router.patch('/msg/mark-seen/:groupId', validateAcc, groupController.markMessagesSeen);
router.delete('/msg/:msgId', validateAcc, groupController.deleteMessage);
router.put('/members/:groupId', validateAcc, validate(groupValidation.addOrRemoveMembers), groupController.addMembers);
router.purge('/members/:groupId', validateAcc, validate(groupValidation.addOrRemoveMembers), groupController.removeMembers);
router.get('/msgs/:groupId', validateAcc, groupController.getMessagesByGroupId);
router.post('/report', validateAcc, validate(groupValidation.reportMessage), groupController.reportMessage);
router.get('/report/:reportedId', validateAcc, groupController.getReportedMessage);
router.get('/reports/', validateAcc, groupController.getReportedMssages);

module.exports = router;
