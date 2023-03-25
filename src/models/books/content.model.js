const mongoose = require('mongoose');
const { toJSON } = require('../plugins');

const contentSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
contentSchema.plugin(toJSON);

/**
 * @typedef Content
 */
const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
