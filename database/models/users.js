const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema= mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true,
    minlength: 4
  },
  lname: {
    type: String,
    required: true,
    trim: true,
    minlength: 4
  },
  image: {
      data        : Buffer,
      contentType : String
  },
  college: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      messgae: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8
  }
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['fname', 'lname', 'college', 'email',]);
};


var Users=mongoose.model('users', UserSchema);
module.exports = {Users};
