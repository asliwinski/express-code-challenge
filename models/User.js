const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    index: true,
    unique: true
  },
  role: { type: String, enum: ['student', 'academic', 'administrator'] },
  password: String,
  institution: { type: Schema.Types.ObjectId, ref: 'Institution' }
});

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.statics.add = async function({
  name,
  email,
  password,
  institution
}) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    email,
    password: hash,
    institution
  });

  await newUser.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
