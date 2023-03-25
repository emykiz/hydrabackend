const Joi = require('joi');

const sendMsg = {
  body: Joi.object().keys({
    to: Joi.string().required(),
    text: Joi.string(),
    convId: Joi.string(),
  }),
};

const getMessageByConvId = {
  params: Joi.object().keys({
    convId: Joi.string().required(),
  }),
};

const reportMessage = {
  body: Joi.object().keys({
    msgId: Joi.string().required(),
    convId: Joi.string().required(),
    reason: Joi.string().required(),
  }),
};

module.exports = {
  sendMsg,
  getMessageByConvId,
  reportMessage,
};
