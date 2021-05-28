const { model, Schema } = require('mongoose');
const md5 = require('md5');

const userSchema = Schema({
  email: String,
  password: String,
});

userSchema.methods.isValidPassword = function isValidPassword(password) {
  return md5(password) === this.password;
};

module.exports = model('User', userSchema);
