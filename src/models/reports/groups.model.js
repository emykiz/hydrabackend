const { Schema, model } = require('mongoose');

const schema = new Schema({
  reporterId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportedMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    required: true,
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Conv',
  },
  reason: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
  },
});

const groupReports = model('GroupReport', schema);
module.exports = groupReports;
