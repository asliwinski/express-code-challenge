const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const institutionSchema = new Schema({
  name: String,
  url: {
    type: String,
    index: true,
    unique: true
  },
  emailDomain: String
});

const Institution = mongoose.model('Institution', institutionSchema);

module.exports = Institution;
