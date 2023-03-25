const express = require('express');
const validate = require('../../middlewares/validate');
const { convValidation } = require('../../validations');
const { convController } = require('../../controllers');
const { multipleUpload } = require('../../libs/multer');

// eslint-disable-next-line no-unused-vars
const auth = require('../../middlewares/auth');
const validateAcc = require('../../middlewares/validateUser');

const router = express.Router();

router.post('/send', multipleUpload, validateAcc, validate(convValidation.sendMsg), convController.sendMessage);
router.get('/msgs/:convId', validateAcc, validate(convValidation.getMessageByConvId), convController.getMessageByConvId);
router.get('/recent', validateAcc, convController.getRecentConversations);
router.delete('/:id', validateAcc, convController.deleteMsg);
router.put('/block/:userId/:convId', validateAcc, convController.blockConversation);
router.purge('/unblock/:userId/:convId', validateAcc, convController.unBlockConversation);
router.post('/report', validateAcc, validate(convValidation.reportMessage), convController.reportMessage);
router.get('/report/:reportId', validateAcc, convController.getAReport);
router.get('/reports', validateAcc, convController.getReports);

module.exports = router;
