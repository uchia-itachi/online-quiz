const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var CompetativeSchema= mongoose.Schema({
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
    }
  }
]
}
});



var Competative=mongoose.model('competative', CompetativeSchema);
module.exports = {Competative};
