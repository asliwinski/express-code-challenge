const express = require('express');
const passport = require('passport');
const Book = require('../models/Book');
const sendError = require('./errorHandler');
const router = express.Router();

/* GET books listing. */
router.get(
  '/',
  passport.authenticate('basic', { session: false }),
  async function(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const data = await Book.paginate(
        { institution: req.user.institution },
        { page, limit: 10 }
      );
      res.send({
        status: 'success',
        data
      });
    } catch (error) {
      sendError(res, error);
    }
  }
);

module.exports = router;
