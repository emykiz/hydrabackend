/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { noteService } = require('../services');

const saveNote = catchAsync(async (req, res) => {
  // const note = await noteService.createNote();
  const data = { ...req.body, user: req.user._id };

  const note = await noteService.createNote(data);
  if (!note) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'an error occured');
  res.status(httpStatus.CREATED).send('created');
});

const findOneByNotesId = catchAsync(async (req, res) => {
  const note = await noteService.findOneByNotesId(req.params.UserId);
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
  }
  res.send(note);
});

const findAllByUserId = catchAsync(async (req, res) => {
  const note = await noteService.findAllByUserId(req.params.userId);
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
  }
  res.send(note);
});

const deleteOneByNotesId = catchAsync(async (req, res) => {
  const note = await noteService.deleteOneByNotesId(req.params.UserId);
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
  }
  res.send(note);
});
module.exports = {
  saveNote,
  findOneByNotesId,
  findAllByUserId,
  deleteOneByNotesId,
};
