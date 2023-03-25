const axios = require('axios');
const { Community, User, Book } = require('../../models');

// update code later to work with mongodb aggregation
const search = async (keyword) => {
  const query1 = { name: { $regex: keyword, $options: '$i' } };
  const query2 = { title: { $regex: keyword, $options: '$i' } };
  const query3 = {
    $or: [
      {
        name: { $regex: keyword, $options: '$i' },
      },
      {
        username: { $regex: keyword, $options: '$i' },
      },
    ],
  };

  const communities = await Community.find(query1).select(['name', 'info', 'type', 'coverImage']).lean();
  const users = await User.find(query3)
    .select(['username', 'name', 'avatar', 'followingCount', 'followerCount', 'accountType'])
    .lean();
  const books = await Book.find(query2).select(['author', 'title', 'cover', 'likes']).lean();

  const searchResult = [...communities, ...users, ...books];
  return searchResult;
};

/**
 *
 * @param {string} word is the search word
 * @returns an array with the dictionary equivalent of searched word
 */
const lookUp = async (word) => {
  const wordA = word.toString();
  try {
    const req = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordA}`);
    return req.data;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  search,
  lookUp,
};
