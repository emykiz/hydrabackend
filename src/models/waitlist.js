/** @format */

const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const waitModel = mongoose.model('Waitlist', waitlistSchema);

module.exports = waitModel;
