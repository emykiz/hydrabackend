const { Schema, model } = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');
const { toJSON } = require('../plugins');

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    communityId: {
      type: Schema.Types.ObjectId,
      ref: 'Community',
      required: true,
    },
  },
  {
    timestamps: true,
    id: false,
  }
);

schema.plugin(mongoosePaginate);
schema.plugin(toJSON);

const requestModel = model('CommunityRequest', schema);

module.exports = {
  requestModel,
};
