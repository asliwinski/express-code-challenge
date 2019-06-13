const mongoose = require('mongoose');
const config = require('../config').get(process.env.NODE_ENV);

module.exports = function connect() {
  mongoose.connect(config.mongo.url, config.mongo.options);
  return mongoose.connection;
};
