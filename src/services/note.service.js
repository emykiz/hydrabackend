const { Note } = require('../models');

/**
 *
 * @param {object} data
 * @returns typeof object
 */
const createNote = async (data) => {
  const note = await Note.create(data);
  return note;
};

/**
 *
 * @param {ObjectId} userId
 * @returns {Promise<Note>}
 */

const findOneByNotesId = async (userId) => {
  // update this code so that it uses findById
  const note = await Note.findById(userId);
  return note;
};

/**
 *
 * @param {ObjectId} userId
 * @returns {Promise<Note>}
 */

const findAllByUserId = async (userId) => {
  const userNote = await Note.find(userId);
  return userNote;
};

/**
 *
 * @param {ObjectId} noteId
 * @returns {Promise<Note>}
 */
const deleteOneByNotesId = async (noteId) => {
  // update this code so thatit uses findByIdAndDelete or the filed inside {deleteOne} should be {_id: noteId}
  const deleteNote = await Note.deleteOne({_id: noteId});
  return deleteNote;
};

module.exports = {
  createNote,
  findOneByNotesId,
  findAllByUserId,
  deleteOneByNotesId,
};
