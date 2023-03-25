const { Wait } = require('../models');

/**
 * save wiatlist to database
 * @param {string} email
 * @returns {Promise<Waitlist>}
 * */

const creatWaitList = async (email) => {
  return Wait.create(email);
};

// find All waitlist
/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<Waitlist>}
 */

const findAllWaitlist = async () => {
  return Wait.find({});
};

const findOneWaitlist = async (email) => {
  const emailA = Wait.findOne({ email });
  return emailA;
};

const deleteAll = async () => {
  return Wait.deleteMany();
};

module.exports = {
  creatWaitList,
  findAllWaitlist,
  findOneWaitlist,
  deleteAll,
};
