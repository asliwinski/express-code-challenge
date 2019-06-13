module.exports = function(res, error) {
  res.status(500).send({
    status: 'fail',
    data: { error: error.message }
  });
};
