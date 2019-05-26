const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var QuizSchema= mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  type: {
    type: String,
    required: true,
    trim: true,
    minlength: 4
  },
  quizcode: {
    type: String,
    trim: true,
  },
  college: {
    type: String,
    require: true
  },
  subject: {
    type: String,
    require: true
  },
  author: {
    type: String
  },
  questions: {
  type:[{
    question: {
      type: String,
      require: true
    },
    option1:{
      type: String,
      require: true
    },
    option2:{
      type: String,
      require: true
    },
    option3:{
      type: String,
      require: true
    },
    option4:{
      type: String,
      require: true
    },
    cans:{
      type: String,
      require: true
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
  }]
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
  },
  endtime:{
    type:Date,
    default:undefined
  }
}
]
},
starttime: {
  type: Date,
  default: undefined
},
endtime: {
  type: Date,
  default: undefined
}
});

var Quiz=mongoose.model('quiz', QuizSchema);
module.exports = {Quiz};
