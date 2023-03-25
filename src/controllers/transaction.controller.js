/* eslint-disable no-unused-vars */
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { transactionService } = require('../services');

// rememeber to check the account currency
const createTransaction = catchAsync(async (req, res) => {
  const { user } = req;

  const transactionResult = await transactionService.CreateTransaction(
    req.body.amount,
    user._id,
    req.body.userTo,
    req.body.description
  );

  //   if (!transactionResult) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'cannot perform transaction');

  res.status(200).send('transaction successful');
});

const getIUserAccountHistory = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const history = await transactionService.getIUserAccountHistory(req.user._id, page, limit);
  if (!history) throw new ApiError(httpStatus.NOT_FOUND, 'no transaction history for this account');
  res.status(200).send(history);
});

const getUserAccountBalance = catchAsync(async (req, res) => {
  const balance = await transactionService.getUserAccountBalance(req.user._id);
  if (!balance) throw new ApiError(httpStatus.NOT_FOUND, 'no transaction history for this account');
  res.status(200).send(balance);
});

module.exports = { createTransaction, getIUserAccountHistory, getUserAccountBalance };
