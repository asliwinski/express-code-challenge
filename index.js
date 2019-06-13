const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport'),
  // LocalStrategy = require('passport-local').Strategy,
  BasicStrategy = require('passport-http').BasicStrategy;
const User = require('./models/User');
const app = express();

const index = require('./routes/index.js');
const users = require('./routes/users');
const books = require('./routes/books');

const connect = require('./db/connection');
const connection = connect();

module.exports = {
  app,
  connection
};

function listen() {
  app.listen(3000, () =>
    console.log(`Open http://localhost:3000 to see a response.`)
  );
}

passport.use(
  new BasicStrategy(function(username, password, done) {
    User.findOne({ name: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  })
);

// parse application/json
app.use(bodyParser.json());

// initialize passport
app.use(passport.initialize());

app.get('/', index);
app.use('/users', users);
app.use('/books', books);

connection
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);
