const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var AdminSchema= mongoose.Schema({
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

AdminSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['fname', 'lname', 'email',]);
};


var Admins=mongoose.model('admins', AdminSchema);
module.exports = {Admins};
