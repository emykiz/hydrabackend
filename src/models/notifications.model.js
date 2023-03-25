const { Schema, model } = require('mongoose');

const notificationSchema = new Schema(
  {
    image: {
      type: String,
      enum: ['thumb', 'person'], // this  would be updated  gradually
    },
    message: {
      type: String,
      required: true,
      minLength: 1,
    },
    link: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

notificationSchema.methods.seen = function () {
  this.isSeen = true;
  return this.save;
};

const notifyModel = model('notification', notificationSchema);

module.exports = notifyModel;
