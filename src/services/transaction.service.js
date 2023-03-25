/* eslint-disable no-unused-vars */
const _ = require('lodash');
const request = require('request');
const { Transaction, User } = require('../models');
const { initializePayment, verifyPayment } = require('./payment/paystack')(request);

const myCustomLabels = require('../utils/labelPaginate');

const History = Transaction.historyModel;
const Transfer = Transaction.transferModel;

/**
 *
 * @param {string} userFrom holds the id of the user making the trasaction
 * @param {string} descr is the description for what the transaction is for, used for reference.
 * @param {string} userTo holds the is of the user receiving the funds
 * @param {number} amount is self explanatory
 */
const CreateTransactionHistory = async (userFrom, descr, userTo, amount) => {
  const history = await History.create({
    descr,
    fromAccountId: userFrom,
    toAccountId: userTo,
    amount,
  });
  return history;
};

const CreateTransaction = async (amount, userFrom, userTo, descr) => {
  // initialize a session
  const session = await User.startSession();

  // transaction options
  const transactionOptions = {
    readPreference: 'primary',
    readConcern: { level: 'local' },
    writeConcern: { w: 'majority' },
  };

  try {
    const transactionResult = await session.withTransaction(async () => {
      // credit the {userTo} param
      const creditResult = await User.updateOne(
        { _id: userTo },
        {
          $inc: { walletBalance: amount },
        },
        session
      );

      // check if the update was successful.
      // If yes then cotinue else abort
      if (creditResult.modifiedCount === 0) {
        await session.abortTransaction();
        throw new Error('cannot transfer funds');
      }

      // deduct the amount transfered from the {userFrom} user
      const debitResult = await User.updateOne(
        { _id: userFrom },
        {
          $inc: { walletBalance: -amount },
        },
        session
      );

      // if update was not successful rollover update and throw error
      if (debitResult.modifiedCount === 0) {
        await session.abortTransaction();
        throw new Error('cannot transfer funds');
      }
    }, transactionOptions);
    // create transaction history for reference purposes
    await CreateTransactionHistory(userFrom, descr, userTo, amount);
    return transactionResult;
  } catch (e) {
    throw new Error(e);
  } finally {
    // end session
    session.endSession();
  }
};

// implement pagination later
const getIUserAccountHistory = async (userId, page, limit) => {
  // get user history where he/she was either the debitor or creditor
  const options = {
    lean: true,
    customLabels: myCustomLabels,
  };

  const history = await History.paginate(
    { $or: [{ fromAccountId: userId }, { toAccountId: userId }] },
    {
      ...(limit ? { limit } : { limit: 10 }),
      page,
      sort: 'desc',
      ...options,
    }
  );
  return history;
};

const getUserAccountBalance = async (userId) => {
  const balance = await User.findById(userId).select(['walletBalance', 'defaultCurrency']).lean();
  return balance;
};

// amount, username, email
const makePayment = async (req, body) => {
  const form = _.pick(body, ['amount', 'username', 'email']);
  form.metadata = {
    full_name: form.username,
  };

  form.amount *= 100;

  initializePayment(form, (error, body2) => {
    if (error) {
      throw new Error(error);
    }
    const response = JSON.parse(body2);
    return response.data;
  });
};

/**
 *
 * @param {string} ref is gotten from [req.query.reference]
 */
const verifyPaymentA = async (ref) => {
  verifyPayment(ref, (error, body) => {
    if (error) throw new Error(error);
    const response = JSON.parse(body);

    const data = _.at(response.data, ['reference', 'amount', 'customer.email', 'meta.full_name']);

    // eslint-disable-next-line camelcase, no-undef
    [reference, amount, email, full_name] = data;
    // perform trasactions
  });
};

module.exports = {
  CreateTransaction,
  getIUserAccountHistory,
  getUserAccountBalance,
  verifyPaymentA,
  makePayment,
};
