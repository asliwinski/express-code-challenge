process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../index').app;
const Book = require('../models/Book');
const Institution = require('../models/Institution');

const User = require('../models/User');

chai.use(chaiHttp);

describe('API', function() {
  this.timeout(15000);

  Book.collection
    .drop()
    .then(function() {})
    .catch(function() {
      // ignore
    });
  Institution.collection
    .drop()
    .then(function() {})
    .catch(function() {
      // ignore
    });
  User.collection
    .drop()
    .then(function() {})
    .catch(function() {
      // ignore
    });

  beforeEach(function(done) {
    const newInstitution = new Institution({
      name: 'test',
      url: 'test',
      emailDomain: 'example.com'
    });
    newInstitution.save(function(err, newInst) {
      const newBook = new Book({
        isbn: '1234',
        title: 'titme',
        author: 'John Smith',
        institution: newInst
      });

      newBook.save(function(err) {
        const newUser = new User({
          name: 'user',
          email: 'user@example.com',
          password:
            '$2a$10$Euz7ELJWtjocl18p0lwgj.vh3beeN89VJWclUGy0tT1sCqgzzAUNe',
          institution: newInst
        });

        newUser.save(function() {
          done();
        });
      });
    });
  });
  afterEach(function(done) {
    Book.collection.drop();
    Institution.collection.drop();
    User.collection.drop();
    done();
  });

  it('should list ALL user books on /books GET', function(done) {
    chai
      .request(server)
      .get('/books')
      .auth('user', '123')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.data.docs.should.be.a('array');
        done();
      });
  });
  it('should fail with 401 if incorrect password on /books GET', function(done) {
    chai
      .request(server)
      .get('/books')
      .auth('user', '12')
      .end(function(err, res) {
        res.should.have.status(401);
        done();
      });
  });
  it('should add a user on /users/create POST', function(done) {
    chai
      .request(server)
      .post('/users/create')
      .send({ name: 'user', email: 'user1@example.com', password: '123' })
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });
  it('should fail to create a user if domain unknown on /users/create POST', function(done) {
    chai
      .request(server)
      .post('/users/create')
      .send({ name: 'user', email: 'user1@domain.com', password: '123' })
      .end(function(err, res) {
        res.should.have.status(500);
        done();
      });
  });
  it('should authenticate a user on /users/signin POST', function(done) {
    chai
      .request(server)
      .post('/users/signin')
      .auth('user', '123')
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
  });
  it('should fail with 401 if incorrect password on /users/signin POST', function(done) {
    chai
      .request(server)
      .post('/users/signin')
      .auth('user', '12')
      .end(function(err, res) {
        res.should.have.status(401);
        done();
      });
  });
});
