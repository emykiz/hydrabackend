const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, feedService } = require('../services');
const { uploadSingle } = require('../libs/cloudinary');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const { search } = req.query;
  const filter = pick(req.query, ['role']);
  const result = await userService.queryUsers({ search, filter }, req.query);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const updateProfile = catchAsync(async (req, res, next) => {
  const user = await userService.updateUserById(req.user.id, req.body);

  if (!user) return next(new ApiError(httpStatus.NOT_FOUND, 'user not found'));
  res.status(200).send('updated');
});

const updateAvatar = catchAsync(async (req, res) => {
  if (!req.file) throw new ApiError(httpStatus.NO_CONTENT, 'provide an image [jpeg, jpg, png]');

  const { publicId, url } = await uploadSingle(req.file.path);

  req.user.avatar = {
    publicId,
    url,
  };
  await req.user.save();
  res.status(200).send('uploaded succssfully');
});

const follow = catchAsync(async (req, res) => {
  const result = await userService.followUser(req.user._id, req.params.userId);
  if (result === false) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, result);

  res.status(200).send('request sent');
});

const cancelfollow = catchAsync(async (req, res) => {
  const result = await userService.cancelfollow(req.params.requestId);
  // if (!result) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, result);

  res.status(200).send(result);
});

const acceptfollow = catchAsync(async (req, res) => {
  const result = await userService.acceptFollow(req.params.requestId);
  if (!result) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, result);

  res.status(200).send('accepted');
});
const unfollow = catchAsync(async (req, res) => {
  const result = await userService.unfollow(req.user._id, req.params.userId);
  if (!result) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, result);

  res.status(200).send('unfollowed');
});

const getUserFollowers = catchAsync(async (req, res) => {
  const followers = await userService.getUserFollowers(req.params.userId);

  //   if (followers.followerCount === 0) throw new ApiError(httpStatus.NOT_FOUND, 'resource not found');

  res.status(200).send(followers);
});

const getUserFollowings = catchAsync(async (req, res) => {
  const followings = await userService.getUserFollowings(req.params.userId);

  //   if (followings.followingCount === 0) throw new ApiError(httpStatus.NOT_FOUND, 'resource not found');

  res.status(200).send(followings);
});

const getSentRequests = catchAsync(async (req, res) => {
  const request = await userService.getSentRequests(req.params.userId);

  //   if (!request.sentRequests) throw new ApiError(httpStatus.NOT_FOUND, 'resource not found');

  res.status(200).send(request);
});

const getReceivedRequests = catchAsync(async (req, res) => {
  const request = await userService.getReceivedRequests(req.params.userId);

  //   if (!request.receivedRequests) throw new ApiError(httpStatus.NOT_FOUND, 'resource not found');

  res.status(200).send(request);
});

const toggleMatureContents = catchAsync(async (req, res) => {
  await userService.toggleMatureContents(req.user);
  res.status(200).send('updated');
});

const changeDefaultCurrency = catchAsync(async (req, res) => {
  if (!req.body.currency) throw new ApiError(httpStatus.BAD_REQUEST, 'provide currency field');
  await userService.changeCurrency(req.user, req.body.currency);
  res.status(200).send('updated');
});

const getMostFollowedUsers = catchAsync(async (req, res) => {
  const { limit, page } = req.query;
  const users = await feedService.getMostFollowedUsers(req.user._id, { limit, page });

  if (!users) throw new ApiError(httpStatus.NOT_FOUND, 'no users yet');

  res.status(200).send(users);
});

const getMostPopulatedCommunities = catchAsync(async (req, res) => {
  const { limit, page } = req.query;
  const communities = await feedService.getMostPopulatedCommunities(req.user._id, { limit, page });

  if (!communities) throw new ApiError(httpStatus.NOT_FOUND, 'no communities yet');

  res.status(200).send(communities);
});

const getMostLikedBooks = catchAsync(async (req, res) => {
  const { limit, page } = req.query;
  const books = await feedService.getMostLovedBooks(limit, page);

  if (!books) throw new ApiError(httpStatus.NOT_FOUND, 'no books yet');

  res.status(200).send(books);
});

const getPaidBooks = catchAsync(async (req, res) => {
  const { limit, page } = req.query;
  const books = await feedService.getCostliestBooks(limit, page);

  if (!books) throw new ApiError(httpStatus.NOT_FOUND, 'no books yet');

  res.status(200).send(books);
});

const getFreeBooks = catchAsync(async (req, res) => {
  const { limit, page } = req.query;
  const books = await feedService.getFreeBooks(limit, page);

  if (!books) throw new ApiError(httpStatus.NOT_FOUND, 'no books yet');

  res.status(200).send(books);
});

const getLatestBooks = catchAsync(async (req, res) => {
  const { limit, page } = req.query;
  const books = await feedService.getNewestBooks(limit, page);

  if (!books) throw new ApiError(httpStatus.NOT_FOUND, 'no books yet');

  res.status(200).send(books);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
  follow,
  cancelfollow,
  acceptfollow,
  unfollow,
  getUserFollowers,
  getUserFollowings,
  getSentRequests,
  getReceivedRequests,
  updateAvatar,
  toggleMatureContents,
  changeDefaultCurrency,
  getMostFollowedUsers,
  getMostPopulatedCommunities,
  getMostLikedBooks,
  getPaidBooks,
  getFreeBooks,
  getLatestBooks,
};
