const Joi = require('joi');

const createCommunity = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(40).required(),
    info: Joi.string().min(20).max(400).required(),
    type: Joi.string().required(),
    rules: Joi.string().required(),
  }),
};

const joinOrLeaveCommunity = {
  body: Joi.object().keys({
    member: Joi.string().required(),
  }),
};

const addOrRemoveAdmin = {
  body: Joi.object().keys({
    admin: Joi.array().required(),
  }),
};

const createPost = {
  body: Joi.object().keys({
    content: Joi.string().required(),
    communityId: Joi.string().required(),
  }),
};

const updateInfo = {
  body: Joi.object().keys({
    info: Joi.string().required(),
  }),
};

const updateRulesAndType = {
  body: Joi.object().keys({
    rules: Joi.string(),
    type: Joi.string(),
  }),
};

const sharePost = {
  body: Joi.object().keys({
    content: Joi.string(),
  }),
  params: Joi.object().keys({
    postId: Joi.string().required(),
    communityId: Joi.string().required(),
  }),
};

const updatePost = {
  body: Joi.object().keys({
    content: Joi.string().required(),
  }),
};

module.exports = {
  createCommunity,
  joinOrLeaveCommunity,
  createPost,
  updatePost,
  sharePost,
  addOrRemoveAdmin,
  updateInfo,
  updateRulesAndType,
};
