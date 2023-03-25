const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { utilService } = require('../../services');
const ApiError = require('../../utils/ApiError');

const searchEverywhere = catchAsync(async (req, res, next) => {
  const searchResult = await utilService.search(req.query.keyword);
  if (!searchResult) return next(new ApiError(httpStatus.NOT_FOUND, 'reource not found'));
  res.status(200).send(searchResult);
});

const lookUpMeaning = catchAsync(async (req, res, next) => {
  const searchResult = await utilService.lookUp(req.query.word);
  if (!searchResult) return next(new ApiError(httpStatus.NOT_FOUND, 'reource not found'));
  res.status(200).send(searchResult);
});

module.exports = {
  searchEverywhere,
  lookUpMeaning,
};
