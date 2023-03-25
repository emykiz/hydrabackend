const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { waitlistService } = require('../services');
const { emailValidation } = require('../validations/waitlist.validation');
const { sendWaitlistRegistered } = require('../services/email.service');

const addUserToWaitlist = catchAsync(async (req, res) => {
  const { email } = req.body;
  const findExistingemail = await waitlistService.findOneWaitlist(email);

  if (findExistingemail) throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'user already applied for waitlist');

  const { error } = emailValidation.validate({ email });

  if (error) throw new ApiError(httpStatus.BAD_REQUEST, error.message);

  await waitlistService.creatWaitList({ email });
  await sendWaitlistRegistered(email);

  res.status(201).send('user has been added to waitlist');
});

const getUsersFromWaitlist = catchAsync(async (req, res) => {
  const users = await waitlistService.findAllWaitlist();
  if (!users.length) throw new ApiError(httpStatus.NOT_FOUND, 'no user is not part of the waitlist');

  res.status(200).send(users);
});

const removeAllUsersFromWaitlist = catchAsync(async (req, res) => {
  const result = await waitlistService.deleteAll();
  if (!result) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'an error occured');
  res.status(200).send('succssfully deleted all users that applied for waitlist');
});

module.exports = { addUserToWaitlist, getUsersFromWaitlist, removeAllUsersFromWaitlist };
