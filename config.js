const MONGO_URL = process.env.MONGO_URL;

const config = {
  production: {
    mongo: {
      url: undefined
    }
  },
  default: {
    mongo: {
      url: MONGO_URL || 'mongodb://localhost:27017/bibliotech',
      options: { keepAlive: 1, useNewUrlParser: true, useCreateIndex: true }
    }
  },
  test: {
    mongo: {
      url: MONGO_URL || 'mongodb://localhost:27017/bibliotech-test',
      options: { keepAlive: 1, useNewUrlParser: true, useCreateIndex: true }
    }
  }
};

exports.get = function get(env) {
  return config[env] || config.default;
};
