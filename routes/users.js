const express = require('express');
const passport = require('passport');
const router = express.Router();
const sendError = require('./errorHandler');
const User = require('../models/User');
const Institution = require('../models/Institution');

router.post(
  '/signin',
  passport.authenticate('basic', { session: false }),
  function(req, res, next) {
    res.send({
      status: 'success',
      data: null
    });
  }
);

router.post('/create', async function(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const userDomain = email.split('@')[1];

    const institution = await Institution.findOne({ emailDomain: userDomain });

    if (institution) {
      await User.add({ name, email, password, institution });
    } else {
      return sendError(res, new Error('Unknown domain'));
    }

    res.send({
      status: 'success',
      data: null
    });
  } catch (error) {
    sendError(res, error);
  }
});

module.exports = router;
