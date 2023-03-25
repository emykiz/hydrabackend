/* eslint-disable no-unused-vars */
const express = require('express');
const validateAcc = require('../../middlewares/validateUser');
const { utilController } = require('../../controllers');

const router = express.Router();

router.get('/search', validateAcc, utilController.searchEverywhere);
router.get('/dictionary', validateAcc, utilController.lookUpMeaning);

module.exports = router;
