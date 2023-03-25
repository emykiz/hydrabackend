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
  convId: {
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

const convReports = model('Convreport', schema);
module.exports = convReports;
