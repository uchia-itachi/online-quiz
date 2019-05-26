const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var FacualtySchema= mongoose.Schema({
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
  college: {
    type: String,
  },
  image: {
      data        : Buffer,
      contentType : String
  },
  subject: {
    type: String,
    require: true
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

FacualtySchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['fname', 'lname', 'college', 'subject','email',]);
};


var Facualtys=mongoose.model('facualty', FacualtySchema);
module.exports = {Facualtys};
