const mongoose = require('mongoose');
const { toJSON } = require('../plugins');

const budgetSchema = mongoose.Schema(
  {
    currency: {
      type: String,
    },
    amountDays: {
      type: Number,
    },
    days: {
      type: Number,
    },
    total: {
      type: Number,
    },
    paymentMethod: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
budgetSchema.plugin(toJSON);

/**
 * @typedef Budget
 */
const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
