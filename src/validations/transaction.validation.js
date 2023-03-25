const Joi = require('joi');

const performTransaction = {
  body: Joi.object().keys({
    description: Joi.string().required(),
    amount: Joi.number().required(),
    userTo: Joi.string().required(),
  }),
};

module.exports = {
  performTransaction,
};
