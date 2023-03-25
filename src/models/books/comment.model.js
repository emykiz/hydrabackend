const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { toJSON } = require('../plugins');

const commentSchema = Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
    likedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    dislikedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],

    totalReplies: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
commentSchema.plugin(toJSON);
commentSchema.plugin(mongoosePaginate);

/**
 * @typedef Comment
 */
const Comment = model('Comment', commentSchema);

module.exports = Comment;
