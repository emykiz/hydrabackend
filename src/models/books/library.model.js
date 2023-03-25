const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  liked: {
    type: Boolean,
    default: false,
  },
  page: {
    type: Number,
  },
  type: {
    type: String,
    enum: ['shelved', 'saved'],
    required: true,
  },
});

schema.plugin(mongoosePaginate);

module.exports = model('library', schema);
