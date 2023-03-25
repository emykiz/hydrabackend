const mongoose = require('mongoose');
const validator = require('validator');
const mongoosePaginate = require('mongoose-paginate-v2');
const { toJSON } = require('../plugins');
const categories = require('./catgories');

const bookSchema = mongoose.Schema(
  {
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    cover: {
      type: String,
      default: 'https://google.com/unsplash/jjsdjdshdjbfu3b',
    },
    description: {
      type: String,
    },
    category: {
      type: [String],
      enum: categories,
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: 'User',
    },
    dislikedBy: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: 'User',
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    // comments: {
    //   type: [mongoose.SchemaTypes.ObjectId],
    //   ref: 'Comment',
    // },
    commentCount: {
      type: Number,
      default: 0,
    },
    promoted: {
      type: Boolean,
      default: false,
    },
    promote: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Promote',
    },
    nbChapters: {
      type: Number,
      default: 0,
    },
    // nbPages: {
    //   type: Number,
    //   default: 0,
    // },
    type: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free',
    },
    nbShares: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      default: 'english',
    },
    tags: {
      type: [String],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    isbn: {
      type: String,
      maxlength: 13,
      minlength: 10,
      Validate(value) {
        if (!validator.isISBN(value)) {
          throw new Error('ISBN is not valid');
        }
      },
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
    mature: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
bookSchema.plugin(toJSON);
bookSchema.plugin(mongoosePaginate);

/**
 * Check if name & author is taken
 * @param {string} name & author - The user's name & author
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
bookSchema.statics.isNameTaken = async function (name, author, excludeUserId) {
  const book = await this.findOne({ name, author, _id: { $ne: excludeUserId } });
  return !!book;
};

/**
 * @typedef Book
 */
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
