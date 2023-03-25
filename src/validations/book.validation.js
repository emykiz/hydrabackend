const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBook = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    category: Joi.array().required(),
    mature: Joi.boolean(),
    description: Joi.string(),
    type: Joi.string(),
    language: Joi.string(),
    tags: Joi.array(),
    isbn: Joi.string(),
  }),
};

const getBooks = {
  query: Joi.object().keys({
    title: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const createComment = {
  body: Joi.object().keys({
    bookId: Joi.string().required(),
    parentId: Joi.string(),
    content: Joi.string().required(),
  }),
};

const getBook = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId),
  }),
};

const updateBook = {
  params: Joi.object().keys({
    bookId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      name: Joi.string(),
    })
    .min(1),
};

const updateProfile = {
  body: Joi.object().keys({
    bookname: Joi.string().min(2).max(20),
    phoneNumber: Joi.string().min(8).max(13),
    gender: Joi.string(),
    location: Joi.string(),
    bio: Joi.string().min(100).max(250),
    dob: Joi.date(),
  }),
};

const deleteBook = {
  params: Joi.object().keys({
    bookId: Joi.string().custom(objectId),
  }),
};

const chapter = {
  params: Joi.object().keys({
    bookId: Joi.string(),
  }),
  body: Joi.object().keys({
    content: Joi.string().required(),
    title: Joi.string().required(),
    price: Joi.string(),
    nbPages: Joi.string(),
    no: Joi.number().required(),
  }),
};

const queryChapters = {
  query: Joi.object().keys({
    limit: Joi.number(),
    page: Joi.number().required(),
    title: Joi.string(),
    sortedBy: Joi.string(),
    orderBy: Joi.string(),
  }),
};

const addTolibrary = {
  body: Joi.object().keys({
    bookId: Joi.string().required(),
    page: Joi.number().min(1),
    type: Joi.string(), // can either be shelved or saved
  }),
};

const getBooksInLibrary = {
  query: Joi.object().keys({
    limit: Joi.number().required(),
    page: Joi.number().required(),
    type: Joi.string().required(),
    sortBy: Joi.string().required(),
    user: Joi.string().required(),
  }),
};

module.exports = {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  updateProfile,
  createComment,
  chapter,
  queryChapters,
  addTolibrary,
  getBooksInLibrary,
};
