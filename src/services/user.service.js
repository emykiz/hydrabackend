const httpStatus = require('http-status');
const { User, Follow, Request } = require('../models');
const ApiError = require('../utils/ApiError');
const myCustomLabels = require('../utils/labelPaginate');

// Everything concerning pagination and filtering would be implemented eventually

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async ({ search, filter }, { limit, page, orderBy, sortedBy }) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };
  const users = await User.paginate(
    {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ],
      ...filter,
    },
    {
      ...(limit ? { limit } : { limit: 10 }),
      page,
      sort: { [orderBy]: sortedBy === 'asc' ? 1 : -1 },
      ...options,
    }
  );
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

const isRequestSent = async (userId) => {
  const request = await Request.findOne({ requestedBy: userId });
  return request;
};

/**
 *
 * @param {string} currentUser represents the user making a reqquest
 * @param {string} userId is the id of the user that's being followed
 * @returns true or error
 */
const followUser = async (currentUser, userId) => {
  const requestSent = await isRequestSent(currentUser);

  if (requestSent) throw new ApiError(httpStatus.BAD_REQUEST, 'request already sent');

  const follow = await Request.create({
    userTo: userId,
    requestedBy: currentUser,
  });
  return follow;
};

/**
 *
 * @param {string} currentUser represents the user making a reqquest
 * @param {string} userId is the id of the user that's was followed before {currentUser} makes a request to cancel the follow
 */
const cancelfollow = async (_id) => {
  const result = await Request.deleteOne({ _id });
  return result;
};

/**
 *
 * @param {string} _id is the id for the request
 * @returns true or error
 */
const acceptFollow = async (_id) => {
  const session = await User.startSession();
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };
  try {
    await session.withTransaction(async () => {
      const deleteRequest = await Request.findById(_id);

      if (!deleteRequest) throw new Error('cannot find request');

      const makeFollower = await Follow.create(
        {
          followedUser: deleteRequest.userTo,
          followingUser: deleteRequest.requestedBy,
        }
        // session
      );
      if (!makeFollower) {
        await session.abortTransaction();
        throw new Error('could not accept request');
      }

      const user1 = await User.updateOne({ _id: deleteRequest.userTo }, { $inc: { followerCount: 1 } }, session);
      if (user1.modifiedCount === 0) {
        await session.abortTransaction();
        throw new Error('could not accept request');
      }

      const user2 = await User.updateOne({ _id: deleteRequest.requestedBy }, { $inc: { followingCount: 1 } }, session);

      if (user2.modifiedCount === 0) {
        await session.abortTransaction();
        throw new Error('could not accept request');
      }
      await Request.findByIdAndDelete(_id);
    }, transactionOptions);
    return true;
  } catch (e) {
    throw new Error(e);
  } finally {
    session.endSession();
  }
};

/**
 *
 * @param {string} currentUser represents the user making a reqquest
 * @param {string} userId is the id of the user that wants to unfollow a user
 * @returns true or error
 */
const unfollow = async (currentUser, userId) => {
  const session = await User.startSession();
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };
  try {
    await session.withTransaction(async () => {
      const deleteFollowDoc = await Follow.deleteOne(
        { $and: [{ followedUser: userId }, { followingUser: currentUser }] },
        session
      );

      if (deleteFollowDoc.deletedCount !== 1) {
        await session.abortTransaction();
        throw new Error('could not unfollow user');
      }

      const user1 = await User.updateOne({ _id: userId }, { $inc: { followerCount: -1 } }, session);

      if (user1.modifiedCount === 0) {
        await session.abortTransaction();
        throw new Error('could not unfollow user');
      }

      const user2 = await User.updateOne({ _id: currentUser }, { $inc: { followingCount: -1 } }, session);

      if (user2.modifiedCount === 0) {
        await session.abortTransaction();
        throw new Error('could not unfollow user');
      }
    }, transactionOptions);
    return true;
  } catch (e) {
    throw new Error(e);
  } finally {
    session.endSession();
  }
};

// implement pagination later
const getUserFollowers = async (userId) => {
  const followers = await Follow.find({ followedUser: userId })
    .populate('followingUser', 'avatar name username')
    .select(['-followedUser']);
  return followers;
};

// implement pagination later
const getUserFollowings = async (userId) => {
  const followings = await Follow.find({ followingUser: userId })
    .populate('followedUser', 'avatar name username')
    .select(['-followingUser']);
  return followings;
};

// implement pagination later
const getSentRequests = async (userId) => {
  const requests = await Request.find({ requestedBy: userId }).populate('userTo', 'avatar name username');
  return requests;
};

const getReceivedRequests = async (userId) => {
  const requests = await Request.find({ userTo: userId }).populate('requestedBy', 'avatar name username');
  return requests;
};

const toggleMatureContents = async (user) => {
  const matureContents = user.showMatureContent;
  // eslint-disable-next-line no-param-reassign
  user.showMatureContent = !matureContents;
  // eslint-disable-next-line no-return-await
  return await user.save();
};

const changeCurrency = async (user, currency) => {
  // eslint-disable-next-line no-param-reassign
  user.defaultCurrency = currency;
  // eslint-disable-next-line no-return-await
  return await user.save();
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  followUser,
  cancelfollow,
  acceptFollow,
  unfollow,
  getUserFollowers,
  getUserFollowings,
  getSentRequests,
  getReceivedRequests,
  toggleMatureContents,
  changeCurrency,
};
