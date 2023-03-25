const { Schema, model } = require('mongoose');
const mongoosePagination = require('mongoose-paginate-v2');
const { toJSON } = require('../plugins');

const schema = new Schema({
  author: {
    type: String,
    required: true,
    ref: 'User',
  },
  content: {
    type: String,
    required: true,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'CommunityComment',
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'CommunityPost',
    required: true,
  },
  replyCount: {
    type: Number,
    default: 0,
  },
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'CommunityComment',
    },
  ],
  likes: {
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    count: {
      type: Number,
      default: 0,
    },
  },
});

schema.plugin(mongoosePagination);
schema.plugin(toJSON);
const commentSchema = model('CommunityComment', schema);
module.exports = commentSchema;
