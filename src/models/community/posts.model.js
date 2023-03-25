const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { toJSON } = require('../plugins');

const schema = new Schema(
  {
    content: {
      type: String,
      minlength: 1,
    },
    communityId: {
      type: Schema.Types.ObjectId,
      ref: 'Community',
      required: true,
    },
    file: {
      type: Schema.Types.Mixed,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'CommunityComment',
      },
    ],
    commentCount: {
      type: Number,
      default: 0,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: {
      likedBy: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      count: {
        type: Number,
        default: 0,
      },
    },
    shares: {
      sharedBy: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      count: {
        type: Number,
        default: 0,
      },
    },
    // this is the id for a shared post
    sharedPostId: {
      type: Schema.Types.ObjectId,
      ref: 'CommunityPost',
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(mongoosePaginate);
schema.plugin(toJSON);

const postModel = model('CommunityPost', schema);
module.exports = postModel;
