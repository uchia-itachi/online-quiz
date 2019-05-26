const express=require('express');
const hbs = require('hbs');
const bodyParser=require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var _=require('lodash');
var url = require('url');


var {mongoose} = require('./database/database.js');
var {Users} = require('./database/models/users.js');
var {Facualtys} = require('./database/models/facualty.js');
var {Admins} = require('./database/models/admin.js');
var {Quiz} = require('./database/models/quiz.js');
var {Competative} = require('./database/models/competativequiz.js');
var {College} = require('./database/models/collegequiz.js')
var {Collegelist} = require('./database/models/colleges.js')



var app=express();

hbs.registerPartials(__dirname+'/views/partials');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        //expires: 6000000
    }
}));



app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
      //  res.clearCookie('user_sid');
    }
    next();
});

var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
      if(req.session.user.subject){
          res.redirect('/facualtyhome');
        }
        else if(req.session.user.college){
            res.redirect('/userhome');
        }
        else{
          res.redirect('/adminhome');
        }

    }else {
        next();
    }
};




app.get('/',sessionChecker, (req, res) =>{
  Collegelist.find().then((doc) =>{
    console.log(doc);
    res.render('sunilfile.html',{
      doc
    });
  });

});

app.get('/profile', (req, res) =>{
  if(req.session.user && req.cookies.user_sid){
    var profiledetails = {
      fname: req.session.user.fname,
      lname: req.session.user.lname,
      email: req.session.user.email,
      college:req.session.user.college
    }
    res.render('profile',profiledetails);
  }
  else{
    res.redirect('/');
  }
});
//user home and practise page
app.get('/userhome',(req, res) =>{

  var qnames;
  if (req.session.user && req.cookies.user_sid){
    Quiz.find({type:'Practise'}).then((names) =>{
   if (!names) {
            res.send("database error , no quiz found");
   } else {
     if(req.session.user.subject){
         res.redirect('/facualtyhome');
       }
       else if(req.session.user.college){
          console.log(names);
           res.render('userhome', {
            names,
            college: req.session.user.college
           });
       }
       else{
         res.redirect('/adminhome');
       }
   }
 });
    } else {
        res.redirect('/');
    }
});

//facualty view of competative tests
app.get('/competativeresults',(req, res) =>{

  var qnames;
  if (req.session.user && req.cookies.user_sid){
    Quiz.find({type:'Competative'}).then((docs) => { //see the use of distinct
     if(req.session.user.subject){
       console.log(docs);
       res.render('competativeresults', {
        docs
       });

       }
       else if(req.session.user.college){
           res.redirect('/userhome');
       }
       else{
         res.redirect('/adminhome');
       }
 });
    } else {
        res.redirect('/');
    }
});

app.get('/collegeresults',(req, res) =>{

  var qnames;
  if (req.session.user && req.cookies.user_sid){
    Quiz.find({type:'Private'}).then((docs) => { //see the use of distinct
     if(req.session.user.subject){
       res.render('collegeresults', {
        docs
       });

       }
       else if(req.session.user.college){
           res.redirect('/userhome');
       }
       else{
         res.redirect('/adminhome');
       }
 });
    } else {
        res.redirect('/');
    }
});
//load list to delete quiz
app.get('/deletelist', (req,res) => {
  if (req.session.user && req.cookies.user_sid){
    if(req.session.user.subject){
      Quiz.find().distinct('name', function(error, names){
        if(error){
          res.send("some error occured, we will fix it soon");
        }
        else{
          res.render('deletelist',{
            names
          });
        }
      });
    }
  }
});
//delete quiz
app.post('/deletequiz', (req, res) =>{
  //Sconsole.log("here", req.body.name);
  if (req.session.user && req.cookies.user_sid){
    if(req.session.user.subject){
      console.log(req.body.name);
      Quiz.deleteMany({name: req.body.name }, function (err) {
        res.send("deleted");
      });

    }
    else{
      res.redirect('/');
    }
  }
});

app.post('/addcollege', (req, res) =>{
      var colleges = new Collegelist({
        name: req.body.name
      });
      colleges.save().then((doc) => {
        res.send("College Added");
      }, (e) => {
          res.send(e);
      });
});

//user home and challenge page
app.get('/userhomechallenge',(req, res) =>{

  var qnames;
  if (req.session.user && req.cookies.user_sid){
    Quiz.find({type:'Competative'}).then((names)=>{ //see the use of distinct
   if (!names) {
            res.send("database error");
   } else {
     if(req.session.user.subject){
         res.redirect('/facualtyhome');
       }
       else if(req.session.user.college){
         console.log(names);
           res.render('userhomechallenge', {
            names,
            college: req.session.user.college
           });
       }
       else{
         res.redirect('/adminhome');
       }
   }
 });
    } else {
        res.redirect('/');
    }
});

//user home and college page
app.get('/userhomecollege',(req, res) =>{

  var qnames;
  if (req.session.user && req.cookies.user_sid){
    if(req.session.user.subject){
        res.redirect('/facualtyhome');
      }
      else if(req.session.user.college){
        Quiz.find({type:'Private',college:req.session.user.college}).then((names)=> {
       if (!names) {
                res.send("database error");
       } else {
         res.render('userhomecollege', {
          names,
          college: req.session.user.college
         });
       }
     });

      }
      else{
        res.redirect('/adminhome');
      }
    } else {
        res.redirect('/');
    }
});

app.get('/facualtyhome',(req, res) =>{
  if (req.session.user && req.cookies.user_sid) {
    if(req.session.user.subject){
      Users.find().then((doc) => {
          if(doc){
            res.render('facualtyhome',{
              doc
            });
          }else{
            res.render('facualtyhome')
          }
      });

      }
      else if(req.session.user.college){
          res.redirect('/userhome');
      }
      else{
        res.redirect('/adminhome');
      }
    } else {
        res.redirect('/');
    }
});
app.get('/adminhome',(req, res) =>{
  if (req.session.user && req.cookies.user_sid) {
    if(req.session.user.subject){
        res.redirect('/facualtyhome');
      }
      else if(req.session.user.college){
          res.redirect('/userhome');
      }
      else{
        res.render('adminhome');
      }
    } else {
        res.redirect('/');
    }
});
app.get('/createquiz',(req, res) =>{
  if (req.session.user && req.cookies.user_sid) {
    if(req.session.user.subject){
        res.render('createtest',{
          collegename: req.session.user.college,
          subjectname: req.session.user.subject
        });
      }
      else{
          res.redirect('/');
      }
    } else {
        res.redirect('/');
    }
});

app.get('/publicprofile',(req, res) =>{
        var q = url.parse(req.url, true);
        var qname = q.query;
        Users.find({email:qname.email})
         .then((doc)=>{
           if(!doc){
             console.send("<center>no such user found</center>");
           }
           else{
             console.log(doc);
            res.send(doc);
          }
         })
        .catch((err)=>{
            console.log(err);
        });

});

app.get('/colleges', (req,res) => {
  if(req.session.user && req.cookies.user_sid){
    if(req.session.user.subject || req.session.user.college){
      res.redirect('/');
    }
    else{
      Collegelist.find().then((doc) =>{
        console.log(doc);
        res.render('colleges',{
          doc
        });
      });

    }
  }else{
    res.redirect('/');
  }
});

app.get('/facualtylist', (req,res) => {
  if(req.session.user && req.cookies.user_sid){
    if(req.session.user.subject || req.session.user.college){
      res.redirect('/');
    }
    else{
      Facualtys.find().then((doc) =>{
        console.log(doc);
        res.render('facualtylist',{
          doc
        });
      });

    }
  }else{
    res.redirect('/');
  }
});
app.get('/userlist', (req,res) => {
  if(req.session.user && req.cookies.user_sid){
    if(req.session.user.subject || req.session.user.college){
      res.redirect('/');
    }
    else{
    Users.find().then((doc) =>{
        console.log(doc);
        res.render('userlist',{
          doc
        });
      });

    }
  }else{
    res.redirect('/');
  }
});

app.get('/userpractisequiz',(req, res) =>{
  if (req.session.user && req.cookies.user_sid) {
    if(req.session.user.subject){
        res.redirect('facualtyhome');
      }
      else if(req.session.user.college){
        var q = url.parse(req.url, true);
        var qname = q.query;
        Quiz.findOne({name:qname.name})
         .then((doc)=>{
           if(!doc){
             console.log(qname.name);
             console.send("<center>no such quiz found</center>");
           }
           else{
             console.log(doc);
            res.render('userpractisequiz', {
              doc,
              quizname:qname.name
            });
          }
         })
        .catch((err)=>{
            console.log(err);
        });

      }
      else{
        res.redirect('/adminhome');
      }
    } else {
        res.redirect('/');
    }
});

app.get('/userchallengequiz',(req, res) =>{
  if (req.session.user && req.cookies.user_sid) {
    if(req.session.user.subject){
        res.redirect('facualtyhome');
      }
      else if(req.session.user.college){
        var q = url.parse(req.url, true);
        var qname = q.query;
        Quiz.findOne({name:qname.name})
         .then((doc)=>{
           if(!doc){
             console.send("<center>no such quiz found</center>");
           }
           else{
             console.log(doc);
            res.render('userchallengequiz', {
              doc,
              quizname:qname.name
            });
          }
         })
        .catch((err)=>{
            console.log(err);
        });

      }
      else{
        res.redirect('/adminhome');
      }
    } else {
        res.redirect('/');
    }
});
app.post('/usercollegequiz',(req, res) =>{
  if (req.session.user && req.cookies.user_sid) {
    if(req.session.user.subject){
        res.redirect('facualtyhome');
      }
      else if(req.session.user.college){
        var quizname= req.body.quizname;
        var quizcode= req.body.quizcode;
        var dt = new Date();
        dt.setHours( dt.getHours() + 1 );
        Quiz.find({name: quizname})
         .then((doc)=>{
           if(!doc){
             console.send("<center>no such quiz found</center>");
           }
           else{
             console.log(quizcode, doc[0].quizcode);
             if(doc[0].quizcode==quizcode){
//
Quiz.findOne({name:quizname}).then((docs) =>{

  if(docs){
    var arr=docs.userdetails.findIndex(function(element){
      return element.email==req.session.user.email;
    }) ;
    console.log("here");
    if(arr!=-1){
      if(!docs.userdetails[arr].starttime){
        docs.starttime=dt;
        docs.save();
      }
    }
    else{
      var userdetails={
        email:req.session.user.email,
        starttime:dt
      }
      docs.userdetails.push(userdetails);
      docs.save().then((req, res) => {
      });

    }
    var ct=new Date();
    if(ct.getTime()<(docs.userdetails[arr].starttime).getTime()){
      res.render('usercollegequiz', {
        doc: docs,
        dt:(docs.userdetails[arr].starttime).getTime(),
        quizname
      });
    }
    else{
      res.send("u have already attempted test")
    }


  }
});
             }
             else{
               res.send("invalid Code");
             }
          }
         })
        .catch((err)=>{
            console.log(err);
        });

      }
      else{
        res.redirect('/adminhome');
      }
    } else {
        res.redirect('/');
    }
});

app.get('/collegeexamdetails',(req, res) =>{
  if (req.session.user && req.cookies.user_sid) {
    if(req.session.user.subject){
        res.redirect('facualtyhome');
      }
      else if(req.session.user.college){
        var q = url.parse(req.url, true);
        var qname = q.query;
        Quiz.find({name:qname.name})
         .then((doc)=>{
           if(!doc){
             console.send("<center>no such quiz found</center>");
           }
           else{
             console.log(doc, doc[0].college);
            res.render('collegeexamdetails', {
              college: doc[0].college,
              subject: doc[0].subject,
              quizname: doc[0].name,
              username: req.session.user.fname+" "+req.session.user.lname,
              email: req.session.user.email
            });
          }
         })
        .catch((err)=>{
            console.log(err);
        });

      }
      else{
        res.redirect('/adminhome');
      }
    } else {
        res.redirect('/');
    }
});



//student signup
app.post('/signup', (req, res) => {
var user = new Users({
  fname: req.body.fname,
  lname: req.body.lname,
  college: req.body.college,
  email: req.body.email,
  password: req.body.password
});
user.save().then((doc) => {
   req.session.user = user;
  res.redirect('userhome');
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/competativescore', (req, res) => {
  Competative.findOne({name:req.body.testname}).then((doc) =>{
    if(doc){
      var arr=doc.userdetails.findIndex(function(element){
        return element.email==req.session.user.email;
      }) ;
      if(arr!=-1){
        if(doc.userdetails[arr].score<req.body.score){
          doc.userdetails[arr].score=req.body.score;
          doc.save();
        }
      }
      else{
        var userdetails={
          email:req.session.user.email,
          score: req.body.score
        }
        doc.userdetails.push(userdetails);
        doc.save().then((req, res) => {
        });
      }

    }
  });
});

app.post('/collegescore', (req, res) => {
  College.findOne({name:req.body.testname}).then((doc) =>{
    if(doc){
      var arr=doc.userdetails.findIndex(function(element){
        return element.email==req.session.user.email;
      }) ;
      if(arr!=-1){
        if(doc.userdetails[arr].score){
        if(doc.userdetails[arr].score<req.body.score){
          doc.userdetails[arr].score=req.body.score;
        }
        doc.userdetails[arr].starttime=new Date();
        doc.save();
      }else{
        doc.userdetails[arr].score=req.body.score;
        doc.userdetails[arr].starttime=new Date();
        doc.save();
      }
      }

    }
  });
});

//facualty signup
app.post('/fsignup', (req, res) => {
var facualty = new Facualtys({
  fname: req.body.fname,
  lname: req.body.lname,
  college: req.body.college,
  subject: req.body.subject,
  email: req.body.email,
  password: req.body.password
});
facualty.save().then((doc) => {
   req.session.user = facualty;
  res.redirect('facualtyhome');
  }, (e) => {
    console.log(e);
    res.status(400).send(e);
  });
});
//saving quiz data
app.post('/cq',(req, res) => {
  var quiz = new Quiz({
    name: req.body.name,
    type: req.body.type,
    quizcode: req.body.quizcode,
    college: req.body.collegename,
    subject: req.body.subjectname,
    //author : req.session.user.email
  });
  console.log(quiz);
  Quiz.findOne({name:quiz.name,type:quiz.type/*,author:quiz.author*/}).then((doc) => {
    if(doc){
      res.send("quiz already exist")
    }else{
      quiz.save().then((doc) => {
        res.send("Quiz saved");
        }, (e) => {
          res.status(400).send(e);
        });
    }
  });

});
//create question
app.post('/createquestion',(req, res) => {
  var quiz = new Quiz({
    name: req.body.name,
    type: req.body.type,
    quizcode: req.body.quizcode,
    college: req.body.collegename,
    subject: req.body.subjectname,
  //  author : req.session.user.email
  });
  console.log(quiz);
  Quiz.findOne({name:quiz.name,type:quiz.type}).then((doc) =>{
    if(doc){
      console.log("question found");
      questions={
        question : req.body.question,
        option1: req.body.option1,
        option2: req.body.option2,
        option3: req.body.option3,
        option4: req.body.option4,
        cans: req.body.cans
      }
      doc.questions.push(questions);
      doc.save().then(() => {
        res.send("question saved");
      });
    }
    else{
      console.log("question not found");
      res.send("no question found");
    }
  });
});


//user login
app.post('/login', (req, res) => {
var user = new Users({
  email: req.body.email,
  password: req.body.password
});
Users.findOne({email:user.email})
 .then((doc)=>{
   if(!doc){
     res.send("no such user");
   }
   else{
    if(doc.password==user.password){
      console.log("LOGIN SUCCESSFULL");
    req.session.user = doc;
    console.log(req.session.user);
      res.redirect('userhome');
    }
    else{
    //  res.send("WRONG PASSWORD");
    res.redirect('/');
    }
  }
 })
.catch((err)=>{
    console.log(err);
});
});

//facualty LOGIN
app.post('/flogin', (req, res) => {
var facualty = new Facualtys({
  email: req.body.email,
  password: req.body.password
});
Facualtys.findOne({email:facualty.email})
 .then((doc)=>{
   if(!doc){
     res.send("no such user");
   }
   else{
    if(doc.password==facualty.password){
      console.log("LOGIN SUCCESSFULL");
    req.session.user = doc;
    console.log(req.session.user);
      res.redirect('facualtyhome');
    }
    else{
    //  res.send("WRONG PASSWORD");
    res.redirect('/');
    }
  }
 })
.catch((err)=>{
    console.log(err);
});
});

//admin login
app.post('/alogin', (req, res) => {
var admin = new Admins({
  email: req.body.email,
  password: req.body.password
});
Admins.findOne({email:admin.email})
 .then((doc)=>{
   if(!doc){
     res.send( "no such user");
   }
   else{
    if(doc.password==admin.password){
      console.log("LOGIN SUCCESSFULL");
    req.session.user = doc;
    console.log(req.session.user);
      res.redirect('adminhome');
    }
    else{
    //res.send("WRONG PASSWORD");
    res.redirect('/');
    }
  }
 })
.catch((err)=>{
    console.log(err);
});
});


//check practise quiz answer

app.post('/checkpractiseanswer', (req, res) => {
var quiz ={
  name: req.body.name,
  question: req.body.question,
  cans: req.body.ans
};
console.log("name",quiz.name);
Quiz.findOne({name:quiz.name})
 .then((doc)=>{
   if(!doc){
     console.log("no quiz");
     res.send("no such Quiz in database found");
   }
   else{
     let obj = doc.questions.find(obj => obj.question == req.body.question);
     console.log(quiz.name);

     var arr=obj.userdetails.findIndex(function(element){
       return element.email==req.session.user.email;
     });
     var user =doc.userdetails.findIndex(function(element){
       return element.email==req.session.user.email;
     });
     if(user==-1){
       doc.userdetails.push({email: req.session.user.email, score: 0});
     }
     var user =doc.userdetails.findIndex(function(element){
       return element.email==req.session.user.email;
     });
    if(obj.cans==req.body.ans){
      if(arr==-1){
        obj.userdetails.push({email: req.session.user.email, score: 1});
        doc.userdetails[user].score+=1;
      }
      else{
        if(obj.userdetails[arr].score==0){
          obj.userdetails[arr].score=1;
          doc.userdetails[user].score+=1;
        }
      }
      console.log(req.session.user.email);
      console.log("corect answer");
      res.send('true');
    }
    else{
      if(arr==-1){
        obj.userdetails.push({email: req.session.user.email, score: 0});
      }

      console.log("incorrect answer");
      res.send('false');
    }
    var t=0;//total score
    for(var i=0;i<doc.questions.length;i++){

      if(doc.questions[i].userdetails.score==1)
      t++;
    }
    console.log(t);
          doc.save();
  }
 })
.catch((err)=>{
    console.log(err);
});
});


//logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});


app.get('/users', (req, res) =>{
  Users.find().then((users) =>{
    res.send({
      users:users
    });
  }, (e) =>{
    res.status(400).send(e);
  });
});
app.listen(3000, () => {
  console.log("Server running succesfully");
});
