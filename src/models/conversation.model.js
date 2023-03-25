const { Schema, model } = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const schema = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    blocked: [
      {
        type: Boolean,
        default: false,
      },
    ],
    blockedIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

schema.plugin(toJSON);
schema.plugin(paginate);

const convModel = model('Conv', schema);
module.exports = convModel;
