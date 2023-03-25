const myCustomLabels = require('../../utils/labelPaginate');
const { User, Community, Book } = require('../../models');

/**
 *
 * @param {string} userId is used to check if user is a follower, if
 */
const getMostFollowedUsers = async (userId, { limit, page }) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };
  const followers = await User.paginate(
    {
      _id: { $ne: userId },
    },
    {
      page,
      sort: { followerCount: -1 },
      ...(limit ? { limit } : { limit: 10 }),
      select: ['name', 'username', 'avatar', 'followerCount', 'followingCount'],
      ...options,
    }
  );
  return followers;
};

const getMostPopulatedCommunities = async (userId, { limit, page }) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };
  const communities = await Community.paginate(
    {
      'members.id': { $nin: userId },
    },
    {
      page,
      sort: { membersCount: -1 },
      ...(limit ? { limit } : { limit: 10 }),
      select: ['name', 'info', 'type', 'membersCount', 'createdAt'],
      ...options,
    }
  );
  return communities;
};

const getMostLovedBooks = async (limit, page) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };

  const books = await Book.paginate(
    {},
    {
      page,
      sort: { likes: -1 },
      ...(limit ? { limit } : { limit: 10 }),
      select: ['author', 'cover', 'title', 'likes', 'price'],
      ...options,
    }
  );
  return books;
};

const getCostliestBooks = async (limit, page) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };

  const books = await Book.paginate(
    { type: 'premium' },
    {
      page,
      sort: { price: -1 },
      ...(limit ? { limit } : { limit: 10 }),
      select: ['author', 'cover', 'title', 'likes', 'price'],
      ...options,
    }
  );
  return books;
};

const getFreeBooks = async (limit, page) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };

  const books = await Book.paginate(
    { type: 'free' },
    {
      page,
      sort: { title: 1 },
      ...(limit ? { limit } : { limit: 10 }),
      select: ['author', 'cover', 'title', 'likes', 'price'],
      ...options,
    }
  );
  return books;
};

const getNewestBooks = async (limit, page) => {
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };

  const books = await Book.paginate(
    {},
    {
      page,
      sort: { createdAt: 1 },
      ...(limit ? { limit } : { limit: 10 }),
      select: ['author', 'cover', 'title', 'likes', 'price'],
      ...options,
    }
  );
  return books;
};

module.exports = {
  getMostFollowedUsers,
  getMostPopulatedCommunities,
  getMostLovedBooks,
  getCostliestBooks,
  getFreeBooks,
  getNewestBooks,
};
