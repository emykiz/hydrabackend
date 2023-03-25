const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { toJSON } = require('./plugins');

const transferSchema = new Schema(
  {
    fromAccountId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toAccountId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

const historySchema = new Schema(
  {
    fromAccountId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toAccountId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    descr: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

historySchema.plugin(mongoosePaginate);
historySchema.plugin(toJSON);

const transferModel = model('Transfer', transferSchema);
const historyModel = model('TransactionHistory', historySchema);

module.exports = { transferModel, historyModel };
