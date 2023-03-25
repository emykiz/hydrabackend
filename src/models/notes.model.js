const { model, Schema } = require('mongoose');

const schema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const noteModel = model('Note', schema);
module.exports = noteModel;
