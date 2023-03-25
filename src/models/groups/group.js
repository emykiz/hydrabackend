const { Schema, model } = require('mongoose');

const schema = new Schema({
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  muteIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  logo: {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  name: {
    type: String,
    required: true,
  },
  blockIds: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
});

const GroupRoom = model('Group', schema);
module.exports = GroupRoom;
