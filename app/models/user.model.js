/* eslint-disable new-cap */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
  facebook: {
    id: String,
    token: String,
    name: String,
  },
});

// generate that hash
userSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check valid password
userSchema.methods.validPassword = function validPassword(password) {
  console.log(this);
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
