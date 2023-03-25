/* eslint-disable no-unused-vars */
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const validateAcc = require('../../middlewares/validateUser');
const { transactionnController } = require('../../controllers');
const { transactionValidation } = require('../../validations');

const router = express.Router();

router.post('/', validateAcc, validate(transactionValidation.performTransaction), transactionnController.createTransaction);
router.get('/history', validateAcc, transactionnController.getIUserAccountHistory);
router.get('/balance', validateAcc, transactionnController.getUserAccountBalance);

module.exports = router;
