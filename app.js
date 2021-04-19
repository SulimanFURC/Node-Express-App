const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const expressValidator = require('express-validator');


mongoose.connect('mongodb://localhost/nodekb');

let db = mongoose.connection;

//check db connection
db.on('open', function(){
  console.log('Connected to Databse');
});

db.on('error', function(err){
  console.log(err);
});

//Bring in model
let Article = require('./models/article');

// init app
const app = express();

// load view Engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// set public folder
app.use(express.static(path.join(__dirname,'public')));

// Express session midleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));


// Home Route
app.get('/', function(req, res){
  Article.find({}, function(err, articles){
    if(err)
    {
      console.log(err);
    }
    else
    {
        res.render('index', {
        title: 'Articales',
        articles: articles,
      });
    }
  });
});

//Route Files
let articles = require('./routes/articles');
app.use('/articles', articles);




app.listen(3000, function(){
  console.log("Server started at port 3000....");
});