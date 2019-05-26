const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var CollegeSchema= mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  userdetails: { type: [{
    email: {
      type: String,
      trim: true,
    },
    score: {
      type: Number,
      default: 0
    },
    starttime: {
      type: Date,
      default: undefined
    }
  }
]
}
});



var College=mongoose.model('college', CollegeSchema);
module.exports = {College};
