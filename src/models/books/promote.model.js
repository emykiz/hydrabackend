const mongoose = require('mongoose');
const { toJSON } = require('../plugins');

const promoteSchema = mongoose.Schema(
  {
    book: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Book',
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    promotedAt: {
      type: Date,
      default: null,
    },
    promotedUntil: {
      type: Date,
      default: null,
    },
    active: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
    },
    age: {
      type: String,
    },
    gender: {
      type: String,
    },
    tags: {
      type: [String],
    },
    budget: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Budget',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
promoteSchema.plugin(toJSON);

/**
 * @typedef Promote
 */
const Promote = mongoose.model('Promote', promoteSchema);

module.exports = Promote;
