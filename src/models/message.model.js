const { Schema, model } = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const readBySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    _id: false,
  }
);

const messageSchema = new Schema(
  {
    convId: {
      type: Schema.Types.ObjectId,
      ref: 'Conv',
      required: true,
    },
    message: {
      type: Schema.Types.Mixed,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    readBy: [readBySchema],
  },
  {
    timestamps: true,
  }
);

messageSchema.plugin(toJSON);
messageSchema.plugin(paginate);

const msgModel = model('Message', messageSchema);

module.exports = msgModel;
