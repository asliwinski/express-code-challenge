const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  isbn: {
    type: String,
    index: true,
    unique: true
  },
  title: String,
  author: String,
  institution: {
    type: Schema.Types.ObjectId,
    ref: 'Institution',
    index: true,
    unique: true
  }
});

bookSchema.plugin(mongoosePaginate);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
