const { Schema, model } = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');
const { toJSON } = require('../plugins');

const schema = new Schema({
  requestedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  requestedAt: {
    type: Date,
    default: new Date(),
  },
});

schema.plugin(mongoosePaginate);
schema.plugin(toJSON);

const requestMOdel = model('Request', schema);

module.exports = requestMOdel;
