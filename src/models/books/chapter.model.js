const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// const mongoosePaginate = require('mongoose-paginate-v2');

const schema = new Schema(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    price: {
      type: Number,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    nbPages: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: 'https://google.com/unsplash',
    },
    chapterNum: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(mongoosePaginate);

const chapterModel = model('Chapter', schema);

module.exports = chapterModel;
