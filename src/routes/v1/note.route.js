const express = require('express');
// eslint-disable-next-line no-unused-vars
const auth = require('../../middlewares/auth');
const validateAcc = require('../../middlewares/validateUser');
const { noteController } = require('../../controllers');

const router = express.Router();

router.post('/', validateAcc, noteController.saveNote);
// when u run this code you'll realise that only the first get request will work because it shadow's the second
/**
 * To fix this you'll have to add a descriptive endpoint example {/get-by-user/:userId} and {/get-by-noteId/:noteId}
 */
router.get('/:noteId', validateAcc, noteController.findOneByNotesId);
router.get('get-by-user/:userId', validateAcc, noteController.findAllByUserId);
router.delete('get-by-noteId/:noteId', validateAcc, noteController.deleteOneByNotesId);

module.exports = router;
