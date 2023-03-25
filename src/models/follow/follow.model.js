const { Schema, model } = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');
const { toJSON } = require('../plugins');

const schema = new Schema({
  followedUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
  followingUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
  followedAt: {
    type: Date,
    default: new Date(),
  },
});

schema.plugin(mongoosePaginate);
schema.plugin(toJSON);

const followersModel = model('Followers', schema);

module.exports = followersModel;
