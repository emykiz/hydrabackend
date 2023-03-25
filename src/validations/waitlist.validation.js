const Joi = require('joi');

const emailValidation = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
});

module.exports = {
  emailValidation,
};
