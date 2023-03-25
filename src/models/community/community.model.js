const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { toJSON } = require('../plugins');

const memberSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    joinedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    id: false,
    _id: false,
  }
);

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 40,
      unique: true,
    },
    info: {
      type: String,
      minlngth: 10,
      maxlength: 400,
      required: true,
    },
    type: {
      type: String,
      enum: ['private', 'public'],
    },
    rules: {
      type: String,
      required: true,
    },
    adminCount: {
      type: Number,
      default: 0,
    },
    admins: [memberSchema],
    membersCount: {
      type: Number,
      default: 0,
    },
    members: [memberSchema],
    coverImage: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(mongoosePaginate);
schema.plugin(toJSON);

const communityModel = model('Community', schema);
module.exports = communityModel;
