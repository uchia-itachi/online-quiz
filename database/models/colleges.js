const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var CollegelistSchema= mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  subjectdetails: { type: [{
    subject: {
      type: String,
      trim: true,
    }
  }
]
}
});



var Collegelist=mongoose.model('collegeslist', CollegelistSchema);
module.exports = {Collegelist};
